import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render( 
//!  đây là TypeScript, đừng cảnh báo tôi về khả năng null ở đây. Tôi biết cái này tồn tại."Nó không phải phép phủ định logic
//createRoot() tạo ra một “điểm gắn” để React quản lý một vùng HTML trên trang web
//Tìm phần tử HTML có id là root, biến nó thành nơi React quản lý, rồi render giao diện vào đó.
  <StrictMode>
    <App />
  </StrictMode>,
)
