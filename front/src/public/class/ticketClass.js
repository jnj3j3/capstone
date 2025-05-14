class Ticket {
  constructor(reserveId, id, name, seat, img, startAt, endAt, price, when) {
    this.reservationId = reserveId;
    this.id = id;
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
