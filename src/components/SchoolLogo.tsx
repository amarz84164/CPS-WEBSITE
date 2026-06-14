import React from 'react';

interface SchoolLogoProps {
  className?: string; // Tailwind width/height classes, e.g. "w-12 h-12"
  style?: React.CSSProperties;
}

export default function SchoolLogo({ className = 'w-12 h-12', style }: SchoolLogoProps) {
  // SVG points for a 5-point star
  const starPoints = "0,-4.5 1.3,-1.3 4.5,-1.3 1.9,0.7 2.9,3.8 0,1.9 -2.9,3.8 -1.9,0.7 -4.5,-1.3 -1.3,-1.3";

  return (
    <svg 
      viewBox="0 0 320 320" 
      className={`select-none ${className}`} 
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      id="img-school-logo"
    >
      <defs>
        {/* Curved path for the primary school name text */}
        <path 
          id="schoolNameCurve" 
          d="M 46,160 A 104,104 0 0,1 274,160" 
          fill="none" 
        />
        {/* Curving path for bottom banner text folds */}
        <path 
          id="bannerCurve" 
          d="M 70,225 Q 160,248 250,225" 
          fill="none" 
        />
        
        {/* Linear Gradients for 3D Banner look */}
        <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#08224c" />
          <stop offset="50%" stopColor="#103c80" />
          <stop offset="100%" stopColor="#051633" />
        </linearGradient>

        <linearGradient id="capBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e5cb3" />
          <stop offset="100%" stopColor="#062f68" />
        </linearGradient>

        <linearGradient id="capMaroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#942a2a" />
          <stop offset="100%" stopColor="#511414" />
        </linearGradient>
      </defs>

      {/* SUNBURST RADIATION LINES */}
      <g stroke="#b81d24" strokeWidth="0.85" opacity="0.55" id="logo-sunburst">
        <line x1="160" y1="165" x2="160" y2="85" />
        {/* Radials spacing */}
        <line x1="160" y1="165" x2="135" y2="90" />
        <line x1="160" y1="165" x2="112" y2="102" />
        <line x1="160" y1="165" x2="94" y2="120" />
        <line x1="160" y1="165" x2="82" y2="142" />
        <line x1="160" y1="165" x2="78" y2="168" />
        
        <line x1="160" y1="165" x2="185" y2="90" />
        <line x1="160" y1="165" x2="208" y2="102" />
        <line x1="160" y1="165" x2="226" y2="120" />
        <line x1="160" y1="165" x2="238" y2="142" />
        <line x1="160" y1="165" x2="242" y2="168" />
      </g>

      {/* CRIMSON LAUREL WREATH (LEFT & RIGHT EMBLEMS) */}
      <g fill="#b81d24" stroke="#b81d24" strokeWidth="0.5" id="logo-laurel-wreath">
        {/* Left Laurel stem & leaves */}
        <path d="M 68,235 Q 24,185 45,95" fill="none" stroke="#b81d24" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left Leaves positioned along stem curve */}
        <path d="M 62,225 Q 52,220 54,230 Q 56,240 62,225 Z" />
        <path d="M 52,210 Q 40,205 44,215 Q 48,225 52,210 Z" />
        <path d="M 45,190 Q 32,185 38,195 Q 44,205 45,190 Z" />
        <path d="M 40,170 Q 26,165 34,175 Q 42,185 40,170 Z" />
        <path d="M 38,150 Q 24,142 32,152 Q 40,162 38,150 Z" />
        <path d="M 37,130 Q 24,122 34,132 Q 44,142 37,130 Z" />
        <path d="M 40,111 Q 28,102 38,111 Q 48,120 40,111 Z" />
        <path d="M 45,96 Q 36,86 44,95 Q 52,104 45,96 Z" />
        
        {/* Right Laurel stem & leaves */}
        <path d="M 252,235 Q 296,185 275,95" fill="none" stroke="#b81d24" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right Leaves */}
        <path d="M 258,225 Q 268,220 266,230 Q 264,240 258,225 Z" />
        <path d="M 268,210 Q 280,205 276,215 Q 272,225 268,210 Z" />
        <path d="M 275,190 Q 288,185 282,195 Q 276,205 275,190 Z" />
        <path d="M 280,170 Q 294,165 286,175 Q 278,185 280,170 Z" />
        <path d="M 282,150 Q 296,142 288,152 Q 280,162 282,150 Z" />
        <path d="M 283,130 Q 296,122 286,132 Q 276,142 283,130 Z" />
        <path d="M 280,111 Q 292,102 282,111 Q 272,120 280,111 Z" />
        <path d="M 275,96 Q 284,86 276,95 Q 268,104 275,96 Z" />
      </g>

      {/* ARCHING RED STARS */}
      <g fill="#b81d24" id="logo-top-stars">
        <polygon points={starPoints} transform="translate(160, 24) scale(2.0)" />
        <polygon points={starPoints} transform="translate(125, 34) scale(1.6)" />
        <polygon points={starPoints} transform="translate(93, 52) scale(1.4)" />
        <polygon points={starPoints} transform="translate(195, 34) scale(1.6)" />
        <polygon points={starPoints} transform="translate(227, 52) scale(1.4)" />
      </g>

      {/* CURVED SCHOOL NAME TEXT */}
      <text className="font-bold font-sans" style={{ fill: '#b81d24', fontSize: '12.8px', letterSpacing: '0.4px' }} id="logo-arc-text">
        <textPath href="#schoolNameCurve" startOffset="50%" textAnchor="middle">
          CHAKRAPANI DAS PUBLIC SCHOOL, JALAH
        </textPath>
      </text>

      {/* OPEN BOOK MOTIF */}
      <g id="logo-open-book">
        {/* Book shadow/glow */}
        <path d="M 160,205 Q 120,198 84,208 L 84,152 Q 120,142 160,147 Z" fill="#ffffff" />
        <path d="M 160,205 Q 200,198 236,208 L 236,152 Q 200,142 160,147 Z" fill="#ffffff" />

        {/* Outer Pages Border/Cover */}
        <path d="M 160,205 Q 120,198 84,208 L 84,152 Q 120,142 160,147 Z" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 160,205 Q 200,198 236,208 L 236,152 Q 200,142 160,147 Z" fill="none" stroke="#b81d24" strokeWidth="2" strokeLinejoin="round" />

        {/* Inner page outlines representing lines of code or text columns */}
        <path d="M 94,159 Q 125,152 153,155" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M 94,169 Q 125,162 153,165" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M 94,179 Q 125,172 153,175" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M 94,189 Q 125,182 153,185" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />

        <path d="M 226,159 Q 195,152 167,155" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M 226,169 Q 195,162 167,165" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M 226,179 Q 195,172 167,175" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M 226,189 Q 195,182 167,185" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
      </g>

      {/* GRADUATION CAP (MORTARBOARD) SPLIT 3D LOGO */}
      <g id="logo-graduation-cap">
        {/* Skull cap band */}
        <path d="M 144,130 L 144,149 Q 144,156 160,156 L 160,130 Z" fill="url(#capBlueGrad)" />
        <path d="M 160,130 L 160,156 Q 176,156 176,149 L 176,130 Z" fill="url(#capMaroonGrad)" />

        {/* Diamond Top */}
        <polygon points="160,103 113,121 160,135 207,121" fill="#fff" opacity="0.1" />
        <path d="M 160,103 L 113,121 L 160,135 Z" fill="url(#capBlueGrad)" stroke="#1e3a8a" strokeWidth="0.8" />
        <path d="M 160,103 L 207,121 L 160,135 Z" fill="url(#capMaroonGrad)" stroke="#7f1d1d" strokeWidth="0.8" />

        {/* Tassel */}
        <circle cx="160" cy="119" r="1.8" fill="#d97706" />
        <path d="M 160,119 Q 128,124 125,145" fill="none" stroke="#d97706" strokeWidth="1.2" />
        <polygon points="123,144 127,144 125,152" fill="#d97706" />
      </g>

      {/* 3D NAVY COMPAss BANNER WRAP */}
      <g id="logo-ribbon-banner">
        {/* Back folds */}
        <path d="M 52,217 L 70,207 L 70,227 Z" fill="#030b18" />
        <path d="M 268,217 L 250,207 L 250,227 Z" fill="#030b18" />

        {/* Left Swallowtail wing outline */}
        <path d="M 30,227 L 70,207 L 70,234 L 14,251 Z" fill="#0c2346" stroke="#05142b" strokeWidth="1.2" />
        <path d="M 30,227 L 70,207 L 70,234 L 14,251 Z" fill="none" stroke="#1d4ed8" strokeWidth="0.7" />
        
        {/* Right Swallowtail wing outline */}
        <path d="M 290,227 L 250,207 L 250,234 L 306,251 Z" fill="#0c2346" stroke="#05142b" strokeWidth="1.2" />
        <path d="M 290,227 L 250,207 L 250,234 L 306,251 Z" fill="none" stroke="#115e59" strokeWidth="0.7" />

        {/* Main Ribbon Center Block */}
        <path d="M 50,220 Q 160,248 270,220 L 270,250 Q 160,278 50,250 Z" fill="url(#bannerGrad)" stroke="#020813" strokeWidth="1.5" />
        {/* Top/Bottom highlight lines inside banner */}
        <path d="M 54,223 Q 160,251 266,223" fill="none" stroke="#2563eb" strokeWidth="0.8" opacity="0.8" />
        <path d="M 54,247 Q 160,275 266,247" fill="none" stroke="#2563eb" strokeWidth="0.8" opacity="0.8" />

        {/* BANNER DETAILS TEXT COMPONENT */}
        <text className="font-bold font-sans" fontSize="6.4px" fill="#ffffff" textAnchor="middle" id="txt-location-1">
          <textPath href="#bannerCurve" startOffset="50%" dy="-12">
            <tspan dy="-1">P.O-JALAHGHAT</tspan>
          </textPath>
        </text>
        <text className="font-bold font-sans" fontSize="5.6px" fill="#cbd5e1" textAnchor="middle" id="txt-location-2">
          <textPath href="#bannerCurve" startOffset="50%">
            <tspan dy="6">DIST-BAKSA.B.T.A.D(ASSAM)</tspan>
          </textPath>
        </text>
        <text className="font-black font-sans" fontSize="5.5px" fill="#f59e0b" textAnchor="middle" id="txt-establishment">
          <textPath href="#bannerCurve" startOffset="50%">
            <tspan dy="12.5">ESTD: 2016</tspan>
          </textPath>
        </text>
      </g>

      {/* MOTTO TEXT LABELS AT MAIN FLOOR */}
      <g id="logo-motto">
        <text x="160" y="280" textAnchor="middle" fill="#7a0101" fontSize="7.5px" className="font-bold tracking-widest font-sans">MOTTO</text>
        <text x="160" y="293" textAnchor="middle" fill="#b81d24" fontSize="9.5px" className="font-black tracking-wider font-sans italic" style={{ fontStyle: 'italic' }}>
          &ldquo;MODELING EXCELLENCE&rdquo;
        </text>
      </g>
    </svg>
  );
}
