class Ticket {
  constructor(name, seat, img, startAt, endAt, price, when) {
    this.name = name;
    this.seat = seat;
    this.img = img;
    this.price = price;
    this.when = when;
    this.startAt = startAt;
    this.endAt = endAt;
  }
}

export default Ticket;
