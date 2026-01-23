import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      webhookSecret!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new Response(err.message, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.client_reference_id
    
    if (orderId) {
      // Use Service Role Key to bypass RLS and write to orders
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Atualiza o status para 'paid' e salva detalhes do pagamento
      // Nota: order_data é um campo JSONB, estamos atualizando ele via rpc ou update direto se a coluna existir
      // Assumindo que a coluna 'status' existe e 'order_data' ou 'stripeDetails' (criado no types.ts como stripeDetails, mas no banco precisamos ver o schema)
      // No schema.sql anterior, não vi stripeDetails. Vou salvar em um campo jsonb ou criar a coluna.
      // O código frontend usa 'stripeDetails' no tipo Order, mas isso precisa refletir no banco.
      // Vou salvar no campo 'order_data' (JSONB) para garantir flexibilidade, E atualizar o status.
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          // Armazenamos detalhes extras no order_data se existir, ou criamos uma coluna específica se preferir.
          // Como não tenho certeza se a coluna stripeDetails existe no banco real, vou assumir que 'order_data' existe (comum em supabase starter) ou tentar atualizar 'stripe_details' se existir.
          // Vou tentar atualizar apenas status por enquanto e ver se consigo injetar dados.
          // Melhor: atualizar status é o principal.
        })
        .eq('id', orderId)
      
      // Se tivermos erro, logamos.
      if (error) {
        console.error('Error updating order:', error)
        return new Response('Error updating order', { status: 500 })
      }
      
      // Também podemos tentar salvar os detalhes do pagamento se houver uma coluna JSON para isso
      // await supabase.from('orders').update({ payment_details: session }).eq('id', orderId)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
