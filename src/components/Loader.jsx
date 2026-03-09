import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]/90 backdrop-blur-md">
      <div className="relative flex items-center justify-center w-full h-full">
        <style>{`
          .book-loader {
            position: relative;
            width: 120px;
            height: 90px;
            border: 4px solid #a855f7; /* Purple border */
            border-radius: 6px;
            background-color: #f8fafc;
            display: flex;
            box-shadow: 0 0 25px rgba(168, 85, 247, 0.4), inset 0 0 10px rgba(0,0,0,0.1);
            perspective: 1000px;
            transform-style: preserve-3d;
          }
          
          .book-page-left {
            flex: 1;
            border-right: 2px solid #cbd5e1;
            background: #ffffff;
            border-radius: 2px 0 0 2px;
          }
          
          .book-page-right {
            flex: 1;
            background: #ffffff;
            border-radius: 0 2px 2px 0;
            padding: 10px 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            justify-content: center;
          }
          
          .book-line {
            height: 4px;
            background-color: #020617;
            border-radius: 4px;
            width: 100%;
          }
          
          .book-flip-page {
            position: absolute;
            top: 0;
            right: 50%;
            width: 50%;
            height: 100%;
            background: #ffffff;
            border-left: 2px solid #cbd5e1;
            border-radius: 2px 0 0 2px;
            transform-origin: right center;
            animation: flipPage 1.4s infinite ease-in-out;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
          }
          
          @keyframes flipPage {
            0% {
              transform: rotateY(0deg);
              background: #ffffff;
            }
            50% {
              background: #f1f5f9;
            }
            100% {
              transform: rotateY(180deg);
              background: #ffffff;
            }
          }
        `}</style>

        <div className="book-loader">
          <div className="book-page-left"></div>
          <div className="book-page-right">
            <div className="book-line"></div>
            <div className="book-line"></div>
            <div className="book-line"></div>
            <div className="book-line"></div>
            <div className="book-line"></div>
            <div className="book-line"></div>
          </div>
          <div className="book-flip-page"></div>
        </div>
      </div>
    </div>
  );
}
