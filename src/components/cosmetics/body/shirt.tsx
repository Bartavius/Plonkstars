import React from 'react';
import { ShirtProps } from './BodyProps';

class Shirt extends React.Component<ShirtProps> {
  private tier: string;
  private tierStyles: { [key: string]: { borderColor: string; glow: string } };

  constructor(props: ShirtProps) {
    super(props);
    // Default tier if not provided
    this.tier = props.tier || 'common';
    
    // Tier colors or glows based on rarity
    this.tierStyles = {
      common: { borderColor: '#9e9e9e', glow: 'none' },
      uncommon: { borderColor: '#4caf50', glow: '0 0 5px #4caf50' },
      rare: { borderColor: '#2196f3', glow: '0 0 8px #2196f3' },
      epic: { borderColor: '#9c27b0', glow: '0 0 10px #9c27b0' },
      legendary: { borderColor: '#ff9800', glow: '0 0 15px #ff9800' }
    };
  }
  
  getTierStyle() {
    return this.tierStyles[this.tier.toLowerCase()] || this.tierStyles.common;
  }
  
  render() {
    const tierStyle = this.getTierStyle();
    const shirtColor = this.props.color || '#5D3FD3';
    const darkShirtColor = this.props.darkColor || '#4A2CA8';
    
    return (
      <div className="cosmetic-item" style={{ position: 'relative' }}>
        {/* Tier indicator - could be a badge, border, etc. */}
        {/* <div className="tier-badge" 
             style={{ 
               position: 'absolute', 
               top: '-10px', 
               right: '-10px',
               background: tierStyle.borderColor,
               padding: '2px 5px',
               borderRadius: '3px',
               color: 'white',
               fontSize: '0.8em',
               fontWeight: 'bold',
               textTransform: 'uppercase',
               boxShadow: tierStyle.glow
             }}>
          {this.tier}
        </div> */}
        
        {/* The shirt SVG with potentially a glow effect */}
        <svg
          viewBox="0 0 20 15"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ 
            filter: this.tier.toLowerCase() !== 'common' ? `drop-shadow(${tierStyle.glow})` : 'none' 
          }}
        >
          {/* Main Shirt Body */}
          <rect x="6" y="0" width="8" height="10" fill={shirtColor} />
          
          {/* Shoulders/Sleeves */}
          <rect x="4" y="0" width="2" height="4" fill={shirtColor} />
          <rect x="14" y="0" width="2" height="4" fill={shirtColor} />
          
          {/* Collar */}
          <rect x="8" y="0" width="4" height="1" fill={darkShirtColor} />
          
          {/* Button details */}
          <rect x="10" y="2" width="1" height="1" fill="#000000" />
          <rect x="10" y="4" width="1" height="1" fill="#000000" />
          <rect x="10" y="6" width="1" height="1" fill="#000000" />
          
          {/* Bottom hem */}
          <rect x="6" y="10" width="8" height="1" fill={darkShirtColor} />
        </svg>
      </div>
    );
  }
}

export default Shirt;