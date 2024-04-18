interface checkoutTypes {
    [key: string]: {
        price: number;
        discount?: {
            type: string;
            discountedPrice?: number;
            threshold?: number;
            dealQty?: number;
        };
    };
}

class timeToCheckout {
    private pricingRules: checkoutTypes;
    private cart: string[];

    constructor(pricingRules: checkoutTypes) {
        this.pricingRules = pricingRules;
        this.cart = [];
    }

    scan(item: string) {
        this.cart.push(item);
    }

    total(): number {
        let total = 0;

        // Count the occurrence of each item
        const itemCounts: {[key: string]: number} = {};
        this.cart.forEach(item => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        });

        // Calculate the total price with discounts applied
        Object.keys(itemCounts).forEach(item => {
            const count = itemCounts[item];
            const price = this.pricingRules[item].price;
            const discount = this.pricingRules[item].discount;

            if (discount) {
                if (discount.type === 'bulk' && count > discount.threshold!) {
                    total += discount.discountedPrice! * count;
                } else if (discount.type === 'deal') {
                    const dealQty = discount.dealQty!;
                    const dealPrice = price * (dealQty - 1);
                    total += dealPrice * Math.floor(count / dealQty) + price * (count % dealQty);
                } else {
                    total += price * count;
                }
            } else {
                total += price * count;
            }
        });

        return total;
    }
}


const newRules: checkoutTypes = {
    ipd: {
        price: 549.99,
        discount: {
            type: 'bulk',
            threshold: 4,
            discountedPrice: 499.99
        }
    },
    mbp: {
        price: 1399.99
    },
    atv: {
        price: 109.50,
        discount: {
            type: 'deal',
            dealQty: 3,
        }
    },
    vga: {
        price: 30.00
    }
};

const checkout1 = new timeToCheckout(newRules);
checkout1.scan('atv');
checkout1.scan('atv');
checkout1.scan('atv');
checkout1.scan('vga');
console.log(checkout1.total()); // Output: $249.00

const checkout2 = new timeToCheckout(newRules);
checkout2.scan('atv');
checkout2.scan('ipd');
checkout2.scan('ipd');
checkout2.scan('atv');
checkout2.scan('ipd');
checkout2.scan('ipd');
checkout2.scan('ipd');
console.log(checkout2.total()); // Output: $2718.95