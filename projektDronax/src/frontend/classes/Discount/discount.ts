export class Discount {
    constructor(
        public amount: Number,
        public startDate: Date,
        public endDate: Date,
        public idDiscount?: Number
    ) {}
}
