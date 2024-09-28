import 'bootstrap/dist/css/bootstrap.min.css';  // 导入 Bootstrap 样式
import './globals.css';  // 导入 Tailwind 样式

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
