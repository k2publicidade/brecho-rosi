import { CartItem } from '../types';

// Simulate an API call to a shipping carrier (e.g., Correios, Loggi)
export const calculateShippingQuote = async (cep: string, items: CartItem[]): Promise<{ price: number; days: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic validation simulation
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        throw new Error("CEP inválido");
      }

      // Mock Logic:
      // 1. Base price depends on region (simulated by first digit of CEP)
      const regionDigit = parseInt(cleanCep.substring(0, 1));
      let basePrice = 15.00;
      
      if (regionDigit >= 0 && regionDigit <= 2) basePrice = 12.00; // SP/Region
      else if (regionDigit >= 3 && regionDigit <= 5) basePrice = 18.00; // MG/RJ/ES
      else if (regionDigit >= 6 && regionDigit <= 9) basePrice = 25.00; // North/South/NE

      // 2. Weight logic (simulated by item count)
      const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
      const weightSurcharge = (itemCount - 1) * 3.50; // Add R$ 3.50 per extra item

      const finalPrice = basePrice + weightSurcharge;
      
      // Delivery days simulation
      const days = regionDigit <= 2 ? 3 : regionDigit <= 5 ? 5 : 8;

      resolve({
        price: parseFloat(finalPrice.toFixed(2)),
        days: days
      });
    }, 1000); // 1 second delay to simulate network
  });
};