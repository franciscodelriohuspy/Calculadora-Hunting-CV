document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const purchasePriceInput = document.getElementById('purchase-price');
    const mortgageAmountDisplay = document.getElementById('mortgage-amount-display');

    const depositSlider = document.getElementById('deposit-slider');
    const depositValueDisplay = document.getElementById('deposit-value');

    const taxesSlider = document.getElementById('taxes-slider');
    const taxesValueDisplay = document.getElementById('taxes-value');

    const termSlider = document.getElementById('term-slider');
    const termValueDisplay = document.getElementById('term-value');

    const interestSlider = document.getElementById('interest-slider');
    const interestValueDisplay = document.getElementById('interest-value');

    const monthlyPaymentDisplay = document.getElementById('monthly-payment');

    // Helper to format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
    };

    // Calculation Function
    const calculate = (source) => {
        let price = parseFloat(purchasePriceInput.value) || 0;

        // Update Taxes Slider Range (6% to 12% of Price)
        let minTaxes = price * 0.06;
        let maxTaxes = price * 0.12;

        // Only update attributes if they changed to avoid jitter
        if (parseFloat(taxesSlider.min) !== minTaxes || parseFloat(taxesSlider.max) !== maxTaxes) {
            taxesSlider.min = minTaxes;
            taxesSlider.max = maxTaxes;
        }

        // Handle Taxes Value Logic
        let currentTaxes = parseFloat(taxesSlider.value);

        // Clamp value to new range
        if (currentTaxes < minTaxes) currentTaxes = minTaxes;
        if (currentTaxes > maxTaxes) currentTaxes = maxTaxes;

        // If price changed, default to max taxes (12%) as per standard behavior or keep proportional?
        // User said "partan de 6% y lleguen hasta el 12%". Let's default to 12% (max) when price changes for safety.
        if (source === 'price') {
            currentTaxes = maxTaxes;
        }

        taxesSlider.value = currentTaxes;
        taxesValueDisplay.textContent = formatCurrency(currentTaxes);

        // Deposit
        let deposit = parseFloat(depositSlider.value);
        depositValueDisplay.textContent = formatCurrency(deposit);

        // Mortgage Amount = Price + Taxes - Deposit
        let mortgageAmount = price + currentTaxes - deposit;

        // Prevent negative mortgage
        if (mortgageAmount < 0) mortgageAmount = 0;

        mortgageAmountDisplay.textContent = formatCurrency(mortgageAmount);

        // Calculate Monthly Payment
        let termYears = parseInt(termSlider.value);
        termValueDisplay.textContent = `${termYears} años`;

        let interestRate = parseFloat(interestSlider.value);
        interestValueDisplay.textContent = `${interestRate} %`;

        if (mortgageAmount > 0 && interestRate > 0 && termYears > 0) {
            let monthlyRate = (interestRate / 100) / 12;
            let numberOfPayments = termYears * 12;

            let monthlyPayment = mortgageAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

            monthlyPaymentDisplay.textContent = formatCurrency(monthlyPayment);
        } else {
            monthlyPaymentDisplay.textContent = formatCurrency(0);
        }
    };

    // Event Listeners
    purchasePriceInput.addEventListener('input', () => calculate('price'));
    depositSlider.addEventListener('input', () => calculate('deposit'));
    taxesSlider.addEventListener('input', () => calculate('taxes'));
    termSlider.addEventListener('input', () => calculate('term'));
    interestSlider.addEventListener('input', () => calculate('interest'));

    // Initial Calculation
    calculate('price');
});
