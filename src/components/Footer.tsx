export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-sm text-[#264d39]/80 border-t border-green-100 bg-white/50 backdrop-blur-sm">
      © {new Date().getFullYear()} GreenCore — цифровая ботаника нового уровня.
    </footer>
  );
}
