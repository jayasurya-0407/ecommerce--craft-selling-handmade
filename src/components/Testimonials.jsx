export default function Testimonials() {
  const testimonials = [
    { id: 1, quote: "The custom bouquet I ordered for my wedding was absolutely stunning. The attention to detail is unmatched!", author: "Sarah M." },
    { id: 2, quote: "My silk bangles match my outfit perfectly. So elegant and beautifully crafted. Highly recommend Haan Handmade!", author: "Priya K." },
    { id: 3, quote: "The crochet doll is so soft and beautifully made. A perfect gift that will be cherished forever.", author: "Emily R." },
  ];

  return (
    <section className="testimonials" id="testimonials">
      <div className="container fade-in">
        <h2 className="section-title">What Our Clients Say</h2>
        <div className="testimonial-grid">
          {testimonials.map(testimonial => (
            <div className="testimonial-card" key={testimonial.id}>
              <p className="quote">"{testimonial.quote}"</p>
              <span className="author">- {testimonial.author}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
