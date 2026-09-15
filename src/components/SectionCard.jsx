export default function SectionCard({ children, className = '' }) {
  return (
    <section className={`bg-[#f8f4e6] rounded-lg border border-[#d2c2a5] shadow ${className}`}>
      {children}
    </section>
  );
}
