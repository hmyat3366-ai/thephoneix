import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { ChefHat, Utensils, Wine, MonitorSmartphone, TrendingUp, ShieldCheck, MessageCircle, X, Download, MapPin, User, Calendar, Settings, Star, Award, LogOut, Clock, Check, Menu } from 'lucide-react';
import './index.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeMenuTab, setActiveMenuTab] = useState('alacarte');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Booking State
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', date: '', time: '', pax: '', experience: '', requests: '' });
  const [bookingStatus, setBookingStatus] = useState(null); // 'checking', 'available', 'full'
  const [ticketData, setTicketData] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Customer Auth State
  // Customer Auth State
  const [customerUser, setCustomerUser] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('overview'); // overview, bookings, rewards, settings
  const [customerAuthMode, setCustomerAuthMode] = useState('login'); // 'login', 'signup'
  const [signupStep, setSignupStep] = useState(1);
  const [customerLoginForm, setCustomerLoginForm] = useState({ email: '', password: '' });
  const [customerSignupForm, setCustomerSignupForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', password: '', confirmPassword: '' });

  const handleCustomerAuth = (e) => {
    e.preventDefault();
    if (customerAuthMode === 'login') {
      const isWyndham = customerLoginForm.email.toLowerCase().includes('wyndham');
      setCustomerUser({ firstName: 'Guest', email: customerLoginForm.email, isWyndhamEmployee: isWyndham });
      setCurrentPage('home');
    } else {
      if (signupStep < 3) {
        setSignupStep(signupStep + 1);
      } else {
        const isWyndham = customerSignupForm.company.toLowerCase().includes('wyndham') || customerSignupForm.email.toLowerCase().includes('wyndham');
        setCustomerUser({ firstName: customerSignupForm.firstName || 'Guest', email: customerSignupForm.email, isWyndhamEmployee: isWyndham });
        setCurrentPage('home');
        setSignupStep(1);
      }
    }
  };

  const handleGoogleAuth = () => {
    setCustomerUser({ firstName: 'Google User', email: 'user@gmail.com' });
    setCurrentPage('home');
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    if ((loginForm.username === 'wyndham' || loginForm.username === 'investor') && loginForm.password === 'luxury2026') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Access restricted to authorized personnel.');
    }
  };

  // Table Coordinates (Percentages)
  const floorPlanTables = [
    { id: 'T1', name: 'Main Dining (Window)', left: '30%', top: '48%', capacity: 4, type: 'Main' },
    { id: 'T2', name: 'Main Dining (Window)', left: '38%', top: '48%', capacity: 4, type: 'Main' },
    { id: 'T3', name: 'Main Dining', left: '46%', top: '48%', capacity: 4, type: 'Main' },
    { id: 'T4', name: 'Main Dining', left: '53%', top: '48%', capacity: 4, type: 'Main' },
    { id: 'T5', name: 'Main Dining (Center)', left: '32%', top: '70%', capacity: 6, type: 'Main' },
    { id: 'T6', name: 'Main Dining (Center)', left: '42%', top: '70%', capacity: 6, type: 'Main' },
    { id: 'T7', name: 'Main Dining (Center)', left: '51%', top: '70%', capacity: 6, type: 'Main' },
    { id: 'VIP1', name: 'VIP Room 1 (220 SQFT)', left: '71%', top: '48%', capacity: 8, type: 'VIP' },
    { id: 'VIP2', name: 'VIP Room 2 (220 SQFT)', left: '71%', top: '72%', capacity: 8, type: 'VIP' },
    { id: 'VIP3', name: 'VIP Room 3 (220 SQFT)', left: '54%', top: '85%', capacity: 8, type: 'VIP' },
    { id: 'VIP4', name: 'VIP Room 4 (220 SQFT)', left: '36%', top: '85%', capacity: 8, type: 'VIP' },
    { id: 'SP1', name: 'Semi-Private Room', left: '20%', top: '80%', capacity: 10, type: 'Private' },
  ];

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
    
    // Reset status if they change date/time/pax
    if (name === 'date' || name === 'time' || name === 'pax') {
      setBookingStatus(null);
    }
  };

  const checkAvailability = () => {
    const { date, time, pax } = bookingForm;
    if (!date || !time || !pax) return;
    
    setBookingStatus('checking');
    
    setTimeout(() => {
      // Dummy logic: Weekends at 19:00/20:00 for > 2 pax = Full. 
      // Also, randomly if date ends in 1 or 5 and time is 19:00/20:00 = Full.
      const day = new Date(date).getDay();
      let isFull = false;
      if ((day === 5 || day === 6) && (time === '19:00' || time === '20:00') && parseInt(pax) > 2) {
        isFull = true;
      }
      if ((date.endsWith('1') || date.endsWith('5')) && (time === '19:00' || time === '20:00')) {
        isFull = true;
      }
      
      setBookingStatus(isFull ? 'full' : 'available');
    }, 800);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingStatus !== 'available') return;
    
    setTicketData({
      id: 'VIP-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      table: selectedTable ? selectedTable.name : 'Concierge Assigned',
      ...bookingForm
    });
  };

  const downloadTicket = () => {
    const ticketElement = document.getElementById('digital-ticket');
    if (ticketElement) {
      html2canvas(ticketElement, {
        backgroundColor: '#0a0a0a',
        scale: 2 // High resolution
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `Culinary_VIP_Ticket_${ticketData.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };
  const BASE = import.meta.env.BASE_URL;
  const images = {
    hero: `${BASE}assets/hero_shwedagon_distant_view.png`,
    plating: `${BASE}assets/art_of_plating_1783002028019.png`,
    kitchen: `${BASE}assets/modern_commercial_kitchen_1783002039497.png`,
    glassware: `${BASE}assets/crystal_glassware_1783002054553.png`,
    chef: `${BASE}assets/executive_chef_1783002077005.png`,
    manager: `${BASE}assets/restaurant_manager_1783002087781.png`,
    pos: `${BASE}assets/pos_system_1783002100242.png`,
    bohLayout: `${BASE}assets/BOH Hifi.png`,
    fohLayout: `${BASE}assets/FOH Hifi.png`,
    fullLayout: `${BASE}assets/Full.png`,
    interiorLayout: `${BASE}assets/interior.jpg`,
  };

  return (
    <div className="app-container" style={{paddingTop: '70px'}}>
      <nav style={{position: 'fixed', top: 0, left: 0, width: '100%', background: 'rgba(10, 10, 10, 0.95)', borderBottom: '1px solid rgba(212,175,55,0.2)', padding: '1rem 2rem', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)'}}>
        <div style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', zIndex: 1001}} onClick={() => {setCurrentPage('home'); window.scrollTo(0,0); setIsMobileMenuOpen(false);}}>
          <img src={`${BASE}logo.png`} alt="The Phoenix Logo" style={{height: '35px', mixBlendMode: 'lighten', filter: 'brightness(1.5) contrast(1.2)', objectFit: 'contain'}} /> The Phoenix
        </div>
        
        {/* Desktop Menu */}
        <div className="desktop-menu" style={{display: 'flex', gap: '2rem'}}>
          <button onClick={() => {setCurrentPage('home'); window.scrollTo(0,0);}} style={{background: 'none', border: 'none', color: currentPage === 'home' ? 'var(--gold-primary)' : '#fff', fontSize: '1rem', cursor: 'pointer', transition: 'color 0.3s ease'}}>Home</button>
          {currentPage === 'home' && <a href="#reservation" style={{color: '#fff', textDecoration: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'color 0.3s ease'}} onMouseOver={(e)=>e.target.style.color='var(--gold-primary)'} onMouseOut={(e)=>e.target.style.color='#fff'}>Reservation</a>}
          <button onClick={() => {setCurrentPage('about'); window.scrollTo(0,0);}} style={{background: 'none', border: 'none', color: currentPage === 'about' ? 'var(--gold-primary)' : '#fff', fontSize: '1rem', cursor: 'pointer', transition: 'color 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><ShieldCheck size={16}/> About (Investor Portal)</button>
          <button onClick={() => {setCurrentPage('profile'); window.scrollTo(0,0);}} style={{background: customerUser ? 'var(--gold-primary)' : 'transparent', border: '1px solid var(--gold-primary)', color: customerUser ? '#000' : 'var(--gold-primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <User size={16}/> {customerUser ? customerUser.firstName : 'Sign In'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', zIndex: 1001}}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(10,10,10,0.98)', 
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem',
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.4s ease-in-out', zIndex: 1000
        }}>
          <button onClick={() => {setCurrentPage('home'); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} style={{background: 'none', border: 'none', color: currentPage === 'home' ? 'var(--gold-primary)' : '#fff', fontSize: '1.5rem', cursor: 'pointer', fontFamily: 'var(--font-serif)'}}>Home</button>
          {currentPage === 'home' && <a href="#reservation" onClick={() => setIsMobileMenuOpen(false)} style={{color: '#fff', textDecoration: 'none', fontSize: '1.5rem', fontFamily: 'var(--font-serif)'}}>Reservation</a>}
          <button onClick={() => {setCurrentPage('about'); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} style={{background: 'none', border: 'none', color: currentPage === 'about' ? 'var(--gold-primary)' : '#fff', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)'}}><ShieldCheck size={24}/> About (Investor Portal)</button>
          <button onClick={() => {setCurrentPage('profile'); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} style={{background: customerUser ? 'var(--gold-primary)' : 'transparent', border: '1px solid var(--gold-primary)', color: customerUser ? '#000' : 'var(--gold-primary)', padding: '0.8rem 2rem', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-serif)', marginTop: '1rem'}}>
            <User size={20}/> {customerUser ? customerUser.firstName : 'Sign In'}
          </button>
        </div>
      </nav>

      {currentPage === 'home' && (
        <>
          {/* Hero Section */}
      <section className="hero">
        <img src={images.hero} alt="Luxury Dining" className="hero-bg" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge" style={{letterSpacing: '2px', textTransform: 'uppercase', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '0.5rem 1.2rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'inline-block', backgroundColor: 'rgba(255, 77, 77, 0.1)'}}>No Walk-ins. No Exceptions.</span>
          <h1 className="hero-title" style={{fontSize: '4.5rem', textTransform: 'uppercase', letterSpacing: '4px', textShadow: '0 5px 15px rgba(0,0,0,0.8)', margin: '0.5rem 0'}}>The Phoenix</h1>
          <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontWeight: 'normal'}}>Unapologetically Elitist.</h2>
          <p className="hero-desc" style={{maxWidth: '750px', fontSize: '1.15rem', margin: '0 auto 2.5rem', lineHeight: '1.8', textShadow: '0 2px 5px rgba(0,0,0,0.8)', color: '#eaeaea'}}>
            If you have to look at the price, this is not the place for you. We do not cater to the masses, nor do we compromise our atmosphere for the middle class. The Phoenix is an impenetrable sanctuary built exclusively for the 1%—the visionaries, tycoons, and rulers of the economy. Ordinary is simply not permitted here.
          </p>
          <a href="#reservation" className="btn btn-primary" style={{padding: '1rem 3rem', fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase', background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)'}}>Submit Credentials</a>
        </div>
      </section>

      {/* The Concept */}
      <section id="concept" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">The Concept</h2>
            <p className="section-subtitle">Redefining luxury dining in Yangon through authentic European gastronomy, unparalleled service, and an atmosphere of refined elegance.</p>
          </div>
          
          <div className="grid-3">
            <div className="card">
              <Utensils size={40} className="text-gold" style={{marginBottom: '1rem'}} />
              <h3 style={{marginBottom: '1rem'}}>Authentic European</h3>
              <p style={{color: 'var(--text-secondary)'}}>Sourcing the finest ingredients globally to recreate classic European masterpieces with a modern, avant-garde twist.</p>
            </div>
            <div className="card">
              <Wine size={40} className="text-gold" style={{marginBottom: '1rem'}} />
              <h3 style={{marginBottom: '1rem'}}>Exclusive Pairing</h3>
              <p style={{color: 'var(--text-secondary)'}}>A curated cellar featuring rare vintages, perfectly paired by our in-house master sommelier.</p>
            </div>
            <div className="card">
              <ShieldCheck size={40} className="text-gold" style={{marginBottom: '1rem'}} />
              <h3 style={{marginBottom: '1rem'}}>Unmatched Privacy</h3>
              <p style={{color: 'var(--text-secondary)'}}>Private dining suites designed for high-profile individuals, corporate executives, and VIP guests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Aesthetic */}
      <section className="section" style={{backgroundColor: 'var(--bg-panel)'}}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">The Aesthetic</h2>
            <p className="section-subtitle">A visual journey into the standards of Culinary.</p>
          </div>
          
          <div className="image-grid">
            <div className="image-grid-item">
              <img src={images.plating} alt="Art of Plating" />
              <div className="image-caption">The Art of Plating</div>
            </div>
            <div className="image-grid-item">
              <img src={images.glassware} alt="Premium Glassware" />
              <div className="image-caption">Premium Glassware</div>
            </div>
            <div className="image-grid-item" style={{gridColumn: '1 / -1', height: '400px'}}>
              <img src={images.kitchen} alt="Modern Commercial Kitchen" />
              <div className="image-caption">State-of-the-art Kitchen Facilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Reviews */}
      <section className="section" style={{backgroundColor: 'var(--bg-dark)'}}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Location & Excellence</h2>
            <p className="section-subtitle">Situated in the heart of Yangon, delivering world-class service.</p>
          </div>
          <div className="grid-2">
            <div className="card" style={{padding: '2rem', textAlign: 'center'}}>
              <h3 style={{color: 'var(--gold-primary)', marginBottom: '1rem'}}>Prime Location</h3>
              <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>Wyndham Yangon Hotel, Level 5. Offering panoramic views of Kandawgyi Lake and the Shwedagon Pagoda, providing an unmatched ambiance for fine dining.</p>
              <div style={{width: '100%', height: '250px', background: 'var(--bg-lighter)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.4)', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.5)'}}>
                <iframe 
                  src="https://maps.google.com/maps?q=Wyndham%20Grand%20Yangon&t=k&z=17&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{border:0, filter: 'contrast(1.2) saturate(1.1)'}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="3D Location Map"
                ></iframe>
                <div style={{position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(10,10,10,0.85)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--gold-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(212,175,55,0.5)', backdropFilter: 'blur(5px)', pointerEvents: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.5)'}}>
                  <MapPin size={16} /> Wyndham Grand Yangon
                </div>
              </div>
            </div>
            <div className="card" style={{padding: '2rem'}}>
              <h3 style={{color: 'var(--gold-primary)', marginBottom: '1.5rem', textAlign: 'center'}}>Guest Experiences</h3>
              <div style={{marginBottom: '1.5rem', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '1rem'}}>
                <p style={{fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>"An absolute revelation in Yangon. The wine pairing was exquisite and the private room offered exactly the discretion we needed."</p>
                <div style={{color: 'var(--gold-light)', fontSize: '0.9rem'}}>- European Diplomat</div>
              </div>
              <div>
                <p style={{fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>"The standard of service matches top Michelin-starred venues in London and Paris. Highly recommended for corporate hosting."</p>
                <div style={{color: 'var(--gold-light)', fontSize: '0.9rem'}}>- Tech Executive, Singapore</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section id="reservation" className="section" style={{backgroundColor: 'var(--bg-darker)'}}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Reserve Your Experience</h2>
            <p className="section-subtitle">Exclusive bookings for diplomats, corporate events, and VIPs</p>
          </div>

          <div style={{maxWidth: '800px', margin: '0 auto', background: 'var(--bg-dark)', padding: '3rem', borderRadius: '15px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
            {!ticketData ? (
              <form onSubmit={handleBookingSubmit}>
                {/* Table Selection Toggle */}
                <div style={{marginBottom: '2rem', background: 'var(--bg-lighter)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showFloorPlan ? '1.5rem' : '0'}}>
                    <div>
                      <h4 style={{color: 'var(--gold-primary)', margin: 0}}>Table Selection <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>(Optional)</span></h4>
                      <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.2rem 0 0 0'}}>
                        {selectedTable ? `Selected: ${selectedTable.name} (Max ${selectedTable.capacity} Pax)` : 'No specific table selected. Our concierge will assign one.'}
                      </p>
                    </div>
                    <button type="button" onClick={() => setShowFloorPlan(!showFloorPlan)} style={{background: 'var(--bg-dark)', color: 'var(--gold-primary)', border: '1px solid var(--gold-primary)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease'}}>
                      {showFloorPlan ? 'Close Map' : (selectedTable ? 'Change Table' : 'Choose on Map')}
                    </button>
                  </div>
                  
                  {showFloorPlan && (
                    <div style={{position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.4)'}}>
                      <img src={images.fohLayout} alt="FOH Floor Plan" style={{width: '100%', display: 'block'}} />
                      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)'}}></div>
                      
                      {floorPlanTables.map(table => (
                        <div 
                          key={table.id}
                          onClick={() => { setSelectedTable(table); setShowFloorPlan(false); setBookingForm(prev => ({...prev, pax: table.capacity})); }}
                          style={{
                            position: 'absolute',
                            left: table.left,
                            top: table.top,
                            width: '24px',
                            height: '24px',
                            background: selectedTable?.id === table.id ? '#28a745' : 'var(--gold-primary)',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(212,175,55,0.8), 0 0 20px rgba(212,175,55,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            zIndex: 10
                          }}
                          title={`${table.name} (Capacity: ${table.capacity} Pax)`}
                        >
                          <div style={{width: '12px', height: '12px', background: 'var(--bg-dark)', borderRadius: '50%'}}></div>
                        </div>
                      ))}
                      <div style={{position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.8)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#fff', display: 'flex', gap: '1rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div style={{width: '12px', height: '12px', background: 'var(--gold-primary)', borderRadius: '50%'}}></div> Available</div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div style={{width: '12px', height: '12px', background: '#28a745', borderRadius: '50%'}}></div> Selected</div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem'}}>
                  <div>
                    <label style={{display: 'block', color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Full Name</label>
                    <input type="text" name="name" value={bookingForm.name} onChange={handleBookingChange} placeholder="e.g., U Aung Khant" required style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Contact Number</label>
                    <input type="tel" name="phone" value={bookingForm.phone} onChange={handleBookingChange} placeholder="+95 9..." required style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} />
                  </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem'}}>
                  <div>
                    <label style={{display: 'block', color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Date</label>
                    <input type="date" name="date" value={bookingForm.date} onChange={handleBookingChange} onBlur={checkAvailability} required style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', colorScheme: 'dark'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Time</label>
                    <select name="time" value={bookingForm.time} onChange={handleBookingChange} onBlur={checkAvailability} required style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}}>
                      <option value="">Select Time</option>
                      <option value="18:00">18:00 (Dinner)</option>
                      <option value="19:00">19:00 (Dinner)</option>
                      <option value="20:00">20:00 (Dinner)</option>
                      <option value="21:00">21:00 (Dinner)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{display: 'block', color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Guests (Pax)</label>
                    <input type="number" name="pax" value={bookingForm.pax} onChange={handleBookingChange} onBlur={checkAvailability} min="1" max="20" placeholder="2" required style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} />
                  </div>
                </div>

                {bookingStatus === 'checking' && (
                  <div style={{color: 'var(--gold-light)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center'}}>Checking availability...</div>
                )}
                {bookingStatus === 'full' && (
                  <div style={{background: 'rgba(220, 53, 69, 0.1)', border: '1px solid #dc3545', color: '#ff6b6b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center'}}>
                    <strong>Fully Booked!</strong> We are sorry, but we have reached maximum seating capacity for this date and time. Please select another slot.
                  </div>
                )}
                {bookingStatus === 'available' && (
                  <div style={{background: 'rgba(40, 167, 69, 0.1)', border: '1px solid #28a745', color: '#28a745', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center'}}>
                    <strong>Seats Available!</strong> You can proceed with your reservation request.
                  </div>
                )}

                <div style={{marginBottom: '1.5rem'}}>
                  <label style={{display: 'block', color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Dining Experience</label>
                  <select name="experience" value={bookingForm.experience} onChange={handleBookingChange} required style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}}>
                    <option value="">Select an experience</option>
                    <option value="ala_carte">A La Carte Dining</option>
                    <option value="set_1">Menu I: The Signature Experience ($260)</option>
                    <option value="set_2">Menu II: The Ocean Journey ($220)</option>
                    <option value="set_3">Menu III: The French Classic ($180)</option>
                    <option value="set_4">Menu IV: Earth & Flora ($150)</option>
                    <option value="private_event">Private Corporate Event / Buyout</option>
                  </select>
                </div>

                <div style={{marginBottom: '2rem'}}>
                  <label style={{display: 'block', color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>Special Requests & Dietary Requirements</label>
                  <textarea name="requests" value={bookingForm.requests} onChange={handleBookingChange} rows="3" placeholder="Any allergies, wine pairing requests, or special occasions?" style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', resize: 'vertical'}}></textarea>
                </div>

                <div style={{textAlign: 'center'}}>
                  <button type="button" onClick={checkAvailability} style={{background: 'transparent', color: 'var(--gold-primary)', border: '1px solid var(--gold-primary)', padding: '0.8rem 2rem', borderRadius: '30px', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease', marginRight: '1rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Check Seats</button>
                  <button type="submit" disabled={bookingStatus !== 'available'} style={{background: bookingStatus === 'available' ? 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 100%)' : 'gray', color: bookingStatus === 'available' ? '#000' : '#ccc', border: 'none', padding: '1rem 3rem', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: bookingStatus === 'available' ? 'pointer' : 'not-allowed', transition: 'all 0.3s ease', textTransform: 'uppercase', letterSpacing: '1px'}}>Request Reservation</button>
                  <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem'}}>* A member of our concierge team will contact you to confirm your reservation and arrange any deposit required for Set Menus.</p>
                </div>
              </form>
            ) : (
              <div style={{textAlign: 'center', animation: 'fadeIn 0.5s ease'}}>
                <div style={{width: '80px', height: '80px', background: 'var(--gold-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                  <ShieldCheck size={40} color="#000" />
                </div>
                <h3 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '2rem', marginBottom: '1rem'}}>Booking Confirmed</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Thank you, {ticketData.name}. Your VIP reservation request has been received.</p>
                
                <div id="digital-ticket" style={{background: 'var(--bg-lighter)', border: '1px dashed var(--gold-primary)', borderRadius: '12px', padding: '2rem', position: 'relative', textAlign: 'left', maxWidth: '500px', margin: '0 auto'}}>
                  <div style={{position: 'absolute', top: '-10px', left: '-10px', width: '20px', height: '20px', background: 'var(--bg-dark)', borderRadius: '50%', borderRight: '1px dashed var(--gold-primary)', borderBottom: '1px dashed var(--gold-primary)'}}></div>
                  <div style={{position: 'absolute', top: '-10px', right: '-10px', width: '20px', height: '20px', background: 'var(--bg-dark)', borderRadius: '50%', borderLeft: '1px dashed var(--gold-primary)', borderBottom: '1px dashed var(--gold-primary)'}}></div>
                  <div style={{position: 'absolute', bottom: '-10px', left: '-10px', width: '20px', height: '20px', background: 'var(--bg-dark)', borderRadius: '50%', borderRight: '1px dashed var(--gold-primary)', borderTop: '1px dashed var(--gold-primary)'}}></div>
                  <div style={{position: 'absolute', bottom: '-10px', right: '-10px', width: '20px', height: '20px', background: 'var(--bg-dark)', borderRadius: '50%', borderLeft: '1px dashed var(--gold-primary)', borderTop: '1px dashed var(--gold-primary)'}}></div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '1rem', marginBottom: '1rem'}}>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>Ticket No.</span>
                      <div style={{color: 'var(--gold-primary)', fontSize: '1.2rem', fontWeight: 'bold'}}>{ticketData.id}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>Status</span>
                      <div style={{color: '#28a745', fontSize: '1.1rem', fontWeight: 'bold'}}>CONFIRMED</div>
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>Date</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1.1rem'}}>{ticketData.date}</div>
                    </div>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>Time</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1.1rem'}}>{ticketData.time}</div>
                    </div>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>Guests</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1.1rem'}}>{ticketData.pax} Pax</div>
                    </div>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>Experience</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1rem'}}>{ticketData.experience.replace('_', ' ').toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1rem'}}>
                    <span style={{color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase'}}>Assigned Table / Room</span>
                    <div style={{color: 'var(--gold-primary)', fontSize: '1.1rem', fontWeight: 'bold'}}>{ticketData.table}</div>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
                  <button onClick={downloadTicket} style={{background: 'var(--gold-primary)', color: '#000', border: 'none', padding: '0.8rem 2rem', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <Download size={18} /> Download Ticket
                  </button>
                  <button onClick={() => { setTicketData(null); setBookingStatus(null); setSelectedTable(null); setBookingForm({ name: '', phone: '', date: '', time: '', pax: '', experience: '', requests: '' }); }} style={{background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--text-muted)', padding: '0.8rem 2rem', borderRadius: '30px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease'}}>
                    Make Another Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer / Outro */}
      <footer>
        <div className="container">
          <div className="footer-logo" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}><img src={`${BASE}logo.png`} alt="The Phoenix" style={{height: '40px', mixBlendMode: 'lighten', filter: 'brightness(1.5) contrast(1.2)', objectFit: 'contain'}} /> The Phoenix</div>
          <div className="footer-contact">
            <p>Wyndham Yangon Hotel, Level 5</p>
            <p>invest@thephoenixyangon.com | +95 9 123 456 789</p>
          </div>
          <a href="#" className="btn btn-outline" style={{marginBottom: '3rem'}}>Download Financials (PDF)</a>
          
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} The Phoenix Fine Dining. Confidential Pitch Deck.
          </div>
        </div>
      </footer>
      </>
      )}
      
      {currentPage === 'about' && (
        /* ABOUT / INVESTOR PAGE */
        <section className="section" style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          {(!isAuthenticated && !(customerUser && customerUser.isWyndhamEmployee)) ? (
            <div style={{background: 'var(--bg-dark)', padding: '3rem', borderRadius: '15px', border: '1px solid var(--gold-primary)', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(212,175,55,0.1)'}}>
              <ShieldCheck size={50} color="var(--gold-primary)" style={{marginBottom: '1rem'}} />
              <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', marginBottom: '0.5rem'}}>Restricted Access</h2>
              <p style={{color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem'}}>Please login to view Wyndham shareholder and employee information.</p>
              
              <form onSubmit={handleLogin}>
                <input 
                  type="text" 
                  placeholder="Username (e.g., wyndham)" 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginBottom: '1rem'}}
                  required 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginBottom: '1.5rem'}}
                  required 
                />
                {loginError && <div style={{color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1rem'}}>{loginError}</div>}
                <button type="submit" style={{width: '100%', background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 100%)', color: '#000', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease'}}>Access Portal</button>
              </form>
              <div style={{marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                <p>Hint: Username: wyndham | Password: luxury2026</p>
              </div>
            </div>
          ) : (
            <div style={{background: 'var(--bg-dark)', padding: '4rem', borderRadius: '15px', border: '1px solid rgba(212,175,55,0.3)', width: '100%', maxWidth: '1200px', animation: 'fadeIn 0.5s ease'}}>
              <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', marginBottom: '1rem', fontSize: '2.5rem', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '1rem'}}>Shareholder & Employee Portal</h2>
              
              <div style={{marginTop: '2rem'}}>
                <h3 style={{color: '#fff', marginBottom: '1rem'}}>Welcome, Authorized Personnel.</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6'}}>
                  This section contains confidential operational data, standard operating procedures (SOPs), and internal financial forecasts exclusively for Wyndham Yangon stakeholders.
                </p>
                
                {/* Presentation Details */}
                <div style={{background: 'linear-gradient(to right, rgba(212,175,55,0.1), transparent)', borderLeft: '4px solid var(--gold-primary)', padding: '1.5rem', borderRadius: '0 12px 12px 0', marginBottom: '3rem'}}>
                  <h4 style={{color: 'var(--gold-primary)', fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', letterSpacing: '1px'}}>Project Presentation By</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase'}}>Student Name</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 'bold'}}>Htet Myat Oo</div>
                    </div>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase'}}>Student ID</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1.1rem'}}>DCA-125</div>
                    </div>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase'}}>Age</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1.1rem'}}>21</div>
                    </div>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase'}}>Course</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1.1rem'}}>Diploma in Culinary Arts</div>
                    </div>
                    <div>
                      <span style={{color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase'}}>College</span>
                      <div style={{color: 'var(--text-primary)', fontSize: '1.1rem'}}>MHTM</div>
                    </div>
                  </div>
                </div>
                

      {/* Service Standards (SOP) */}
      <section className="section" style={{padding: '2rem 0', borderBottom: '1px solid rgba(212,175,55,0.2)', marginBottom: '2rem'}}>
        <div className="section-header" style={{marginBottom: '2rem'}}>
          <h2 className="section-title" style={{fontSize: '2rem'}}>Service Standards (SOP)</h2>
          <p className="section-subtitle">Defining the Pinnacle of Luxury Dining</p>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div style={{background: 'var(--bg-lighter)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}}>
            <div style={{background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--gold-primary)'}}>
              <Award size={24} />
            </div>
            <div>
              <h3 style={{color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)'}}>White-Glove Service</h3>
              <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6'}}>Every interaction is meticulously choreographed. From the personalized greeting by our hostess to the synchronized presentation of courses by our trained head waiters, we ensure a flawless European dining etiquette.</p>
            </div>
          </div>

          <div style={{background: 'var(--bg-lighter)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}}>
            <div style={{background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--gold-primary)'}}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)'}}>Discreet VIP Handling</h3>
              <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6'}}>Recognizing our core demographic of diplomats and UHNWIs, our staff is trained in complete discretion. Private dining suites feature dedicated waitstaff, sound-dampened environments, and secure VIP entry protocols.</p>
            </div>
          </div>

          <div style={{background: 'var(--bg-lighter)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start'}}>
            <div style={{background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--gold-primary)'}}>
              <Star size={24} />
            </div>
            <div>
              <h3 style={{color: 'var(--gold-primary)', marginBottom: '0.5rem', fontSize: '1.2rem', fontFamily: 'var(--font-serif)'}}>Concierge & Sommelier</h3>
              <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6'}}>Beyond serving food, we offer experiences. Our in-house Master Sommelier provides bespoke wine pairings, while our concierge proactively manages dietary preferences and special occasion arrangements before the guest arrives.</p>
            </div>
          </div>
        </div>
      </section>
                
      {/* Architectural Layout */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Architectural Layout</h2>
            <p className="section-subtitle">Comprehensive zoning for Front of House (FOH) and Back of House (BOH) operations.</p>
          </div>
          
          <div style={{marginBottom: '3rem'}}>
            <h3 style={{color: 'var(--gold-primary)', marginBottom: '1rem', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.8rem'}}>Full Floor Plan</h3>
            <div style={{borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)', cursor: 'pointer', transition: 'transform 0.3s ease'}} onClick={() => setSelectedImage(images.fullLayout)} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img src={images.fullLayout} alt="Full Layout" style={{width: '100%', display: 'block'}} />
            </div>
          </div>
          
          <div className="grid-2">
            <div>
              <h3 style={{color: 'var(--gold-primary)', marginBottom: '1rem', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.5rem'}}>Front of House (FOH)</h3>
              <div style={{borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)', cursor: 'pointer', transition: 'transform 0.3s ease'}} onClick={() => setSelectedImage(images.fohLayout)} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <img src={images.fohLayout} alt="FOH Layout" style={{width: '100%', display: 'block'}} />
              </div>
            </div>
            <div>
              <h3 style={{color: 'var(--gold-primary)', marginBottom: '1rem', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.5rem'}}>Back of House (BOH)</h3>
              <div style={{borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)', cursor: 'pointer', transition: 'transform 0.3s ease'}} onClick={() => setSelectedImage(images.bohLayout)} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <img src={images.bohLayout} alt="BOH Layout" style={{width: '100%', display: 'block'}} />
              </div>
            </div>
          </div>

          <div style={{marginTop: '3rem'}}>
            <h3 style={{color: 'var(--gold-primary)', marginBottom: '1rem', textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.5rem'}}>Interior Layout Design</h3>
            <div style={{borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)', cursor: 'pointer', transition: 'transform 0.3s ease'}} onClick={() => setSelectedImage(images.interiorLayout)} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <img src={images.interiorLayout} alt="Interior Layout" style={{width: '100%', display: 'block'}} />
            </div>
          </div>

          <h3 style={{color: 'var(--gold-primary)', marginTop: '4rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)'}}>Construction & Interior Fit-out Budget</h3>
          <div className="fin-table-wrapper">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Project Component</th>
                  <th>Budget (Lakhs MMK)</th>
                  <th>Budget (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>FOH Interior Fit-out & Furniture</td>
                  <td>2,000 Lakhs</td>
                  <td>$50,000</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>BOH Interior Fit-out (Kitchen)</td>
                  <td>350 Lakhs</td>
                  <td>$8,750</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Internal MEP Works</td>
                  <td>200 Lakhs</td>
                  <td>$5,000</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{backgroundColor: 'rgba(212,175,55,0.1)'}}>
                  <td colSpan="2" style={{color: 'var(--gold-primary)', fontWeight: 'bold', fontSize: '1.1rem'}}>TOTAL LAYOUT & CONSTRUCTION BUDGET</td>
                  <td style={{color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem'}}>2,550 Lakhs</td>
                  <td style={{color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.1rem'}}>$63,750</td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>
      </section>

      {/* Manpower & Synergy Strategy */}
      <section className="section" style={{backgroundColor: 'var(--bg-panel)'}}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Manpower Strategy</h2>
            <p className="section-subtitle">Optimized organizational structure integrating Wyndham's existing infrastructure for maximum profitability.</p>
          </div>

          <div className="grid-2" style={{marginBottom: '3rem'}}>
            <div className="strategy-box" style={{marginBottom: '0'}}>
              <h3 style={{color: 'var(--text-primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)'}}>The "Brain vs. Muscle" Strategy</h3>
              <h4>1. Strategic Investment in Leadership</h4>
              <p>Our budget ($6,250) is strictly allocated to the "Brain" of the operation—the Core Leaders (Head Chef, Manager, Mixologist) who drive quality. We avoid spending on basic labor ("Muscle") like Stewards, Runners, and Commis by tapping into the hotel's existing workforce.</p>
              
              <h4>2. Eliminating Duplicate Costs</h4>
              <p>Wyndham Hotel already operates a 24/7 Central Stewarding and Front Desk system. Hiring dedicated staff for these roles creates duplicate overhead. Instead, we fully integrate into the hotel's ecosystem.</p>
              
              <h4>3. Scalability without Fixed Overhead</h4>
              <p>During peak hours, we dynamically pull runners from the hotel's Casual Pool. During quiet periods, they return to the pool, allowing us to scale instantly without carrying the burden of fixed salaries.</p>
            </div>

            <div className="strategy-box" style={{marginBottom: '0'}}>
              <h3 style={{color: 'var(--text-primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)'}}>Financial & Quality Assurance</h3>
              <h4>1. The 6-Month Payroll Transition</h4>
              <p>Supported by Wyndham's CEO, base salaries for core leaders are covered under the hotel's Central Payroll for the first 6 months. After 6 months, when revenue stabilizes, salaries shift to our Standalone P&L, eliminating initial standalone financial risk.</p>
              
              <h4>2. High-Earning Incentive System</h4>
              <p>Fine dining thrives on performance. While the hotel secures their baseline, 10% Service Charge and direct Tips are pooled and split among the team from day one. This supercharges motivation and drives proactive upselling without adding fixed costs.</p>
              
              <h4>3. Skill & Quality Assurance (Pre-vetted)</h4>
              <p>To ensure shared staff meet luxury standards, our Core Leaders act as Quality Gatekeepers. We only utilize Wyndham's pre-vetted talent, who undergo rigorous fine-dining cross-training by our Executive Chef and Manager before deployment.</p>
            </div>
          </div>

          <h3 style={{color: 'var(--gold-primary)', marginBottom: '1rem', fontFamily: 'var(--font-serif)'}}>1. Kitchen Brigade (Back of House)</h3>
          <div className="fin-table-wrapper">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Qty</th>
                  <th>Monthly / Head</th>
                  <th>3-Month Total</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Executive Chef</td>
                  <td>1</td>
                  <td>22 Lakhs</td>
                  <td>$1,650</td>
                  <td>Dedicated Hire: Full menu curation, QA, and leadership.</td>
                </tr>
                <tr>
                  <td>2. Sous Chef</td>
                  <td>1</td>
                  <td>8 Lakhs</td>
                  <td>$600</td>
                  <td>Dedicated Hire: Line management and inventory control.</td>
                </tr>
                <tr>
                  <td>3. Chef de Partie</td>
                  <td>2</td>
                  <td><span className="shared-badge">Shared</span></td>
                  <td>$0</td>
                  <td>Wyndham Synergy: Cross-deployed from hotel mainline.</td>
                </tr>
                <tr>
                  <td>4. Demi Chef de Partie</td>
                  <td>1</td>
                  <td><span className="shared-badge">Shared</span></td>
                  <td>$0</td>
                  <td>Wyndham Synergy: Assisting CDPs, hotel master payroll.</td>
                </tr>
                <tr>
                  <td>5. Commis Chef</td>
                  <td>3</td>
                  <td><span className="shared-badge">Shared</span></td>
                  <td>$0</td>
                  <td>Hotel Culinary Pool: Basic prep and plating assistance.</td>
                </tr>
                <tr>
                  <td>6. Stewards (Utility)</td>
                  <td>-</td>
                  <td><span className="shared-badge">Shared</span></td>
                  <td>$0</td>
                  <td>Hotel Stewarding: 24/7 central dishwashing system.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{backgroundColor: 'rgba(212,175,55,0.1)'}}>
                  <td colSpan="3" style={{color: 'var(--gold-primary)', fontWeight: 'bold'}}>KITCHEN BRIGADE TOTAL (7+ Pax)</td>
                  <td style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>$2,250</td>
                  <td>Full European Brigade Setup at Optimized Standalone Cost</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <h3 style={{color: 'var(--gold-primary)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', marginTop: '3rem'}}>2. Service Team (Front of House)</h3>
          <div className="fin-table-wrapper">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Qty</th>
                  <th>Monthly / Head</th>
                  <th>3-Month Total</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Restaurant Manager</td>
                  <td>1</td>
                  <td>14 Lakhs</td>
                  <td>$1,050</td>
                  <td>Top-Level Leader: Oversees floor operations and VIP relations.</td>
                </tr>
                <tr>
                  <td>2. Head Waiters</td>
                  <td>2</td>
                  <td>4 Lakhs</td>
                  <td>$600</td>
                  <td>Station Supervisors: Managing table flows and frontline waiters.</td>
                </tr>
                <tr>
                  <td>3. Waiters / Waitresses</td>
                  <td>6</td>
                  <td>3.55 Lakhs</td>
                  <td>$1,600</td>
                  <td>Frontline Service: Guest orders and high-touch experiences.</td>
                </tr>
                <tr>
                  <td>4. Hostess / Greeter</td>
                  <td>1</td>
                  <td><span className="shared-badge">Shared</span></td>
                  <td>$0</td>
                  <td>Wyndham Synergy: Premium guest relations cross-deployment.</td>
                </tr>
                <tr>
                  <td>5. Sommelier</td>
                  <td>-</td>
                  <td><span className="shared-badge">Shared</span></td>
                  <td>$0</td>
                  <td>Bar Team Collaboration: Handled by Mixologist team.</td>
                </tr>
                <tr>
                  <td>6. Food Runners & Bussers</td>
                  <td>-</td>
                  <td><span className="shared-badge">Shared</span></td>
                  <td>$0</td>
                  <td>Hotel Casual Pool: Back-of-house running ($0 cost to restaurant).</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{backgroundColor: 'rgba(212,175,55,0.1)'}}>
                  <td colSpan="3" style={{color: 'var(--gold-primary)', fontWeight: 'bold'}}>SERVICE BRIGADE TOTAL (10+ Pax)</td>
                  <td style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>$3,250</td>
                  <td>Flawless Fine Dining Service Chain at Optimized Cost</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <h3 style={{color: 'var(--gold-primary)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', marginTop: '3rem'}}>3. Bar, Cashier, Reception</h3>
          <div className="fin-table-wrapper">
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Qty</th>
                  <th>Monthly / Head</th>
                  <th>3-Month Total</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Head Mixologist</td>
                  <td>1</td>
                  <td>6 Lakhs</td>
                  <td>$450</td>
                  <td>Core Beverage Leader: High-margin pairings, inventory.</td>
                </tr>
                <tr>
                  <td>2. Bartender</td>
                  <td>1</td>
                  <td>4 Lakhs</td>
                  <td>$300</td>
                  <td>Lounge Execution: Glass management, speed of service.</td>
                </tr>
                <tr>
                  <td>3. Receptionist</td>
                  <td>1</td>
                  <td><span className="shared-badge">Shared</span></td>
                  <td>$0</td>
                  <td>Wyndham Synergy: Manages TableCheck/OpenTable bookings.</td>
                </tr>
                <tr>
                  <td>4. Cashier</td>
                  <td>-</td>
                  <td><span className="shared-badge">Integrated</span></td>
                  <td>$0</td>
                  <td>Central PMS: Direct link to hotel finance, wireless checkouts.</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{backgroundColor: 'rgba(212,175,55,0.1)'}}>
                  <td colSpan="3" style={{color: 'var(--gold-primary)', fontWeight: 'bold'}}>BAR & CONTROL TOTAL (2+ Pax)</td>
                  <td style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>$750</td>
                  <td>High-Margin Beverage Setup with Zero Admin Overhead Waste</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Grand Total Summary Box */}
          <div style={{
            marginTop: '4rem',
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem'}}>Total Core Leadership Investment (3 Months)</h3>
              <p style={{color: 'var(--text-secondary)', margin: 0}}>Combined Budget for Kitchen, Service & Bar Operations</p>
            </div>
            
            <div style={{textAlign: 'right'}}>
              <div style={{color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem'}}>
                MMK 250 Lakhs
              </div>
              <div style={{color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', fontSize: '3.5rem', lineHeight: '1'}}>
                $6,250
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Exquisite Menu Preview */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Culinary Offerings</h2>
            <p className="section-subtitle">A glimpse into our high-margin signature À La Carte and exclusive Set Menus.</p>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem'}}>
            <button 
              onClick={() => setActiveMenuTab('alacarte')}
              style={{
                padding: '0.8rem 2.5rem', 
                borderRadius: '30px', 
                border: '1px solid var(--gold-primary)', 
                background: activeMenuTab === 'alacarte' ? 'var(--gold-primary)' : 'transparent',
                color: activeMenuTab === 'alacarte' ? '#000' : 'var(--gold-primary)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem'
              }}
            >À La Carte Menu</button>
            <button 
              onClick={() => setActiveMenuTab('setmenu')}
              style={{
                padding: '0.8rem 2.5rem', 
                borderRadius: '30px', 
                border: '1px solid var(--gold-primary)', 
                background: activeMenuTab === 'setmenu' ? 'var(--gold-primary)' : 'transparent',
                color: activeMenuTab === 'setmenu' ? '#000' : 'var(--gold-primary)',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem'
              }}
            >Chef's Set Menu</button>
          </div>
          
          {activeMenuTab === 'alacarte' && (
            <div className="grid-2" style={{marginBottom: '4rem'}}>
              {/* Left Column */}
              <div className="menu-category" style={{border: 'none', padding: '0'}}>
                <h4 style={{color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.3rem', fontFamily: 'var(--font-serif)', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.5rem'}}>Salads</h4>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/sa1.png`} alt="Salad 1" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[sa-101] Burrata & Heirloom Tomato</div>
                      <div className="menu-item-price">$28</div>
                    </div>
                    <div className="menu-item-desc">Aged balsamic caviar, basil oil, microgreens</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/sa2.png`} alt="Salad 2" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[sa-102] Classic Caesar</div>
                      <div className="menu-item-price">$25</div>
                    </div>
                    <div className="menu-item-desc">Quail egg, pancetta crisp, parmesan tuile</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/sa3.png`} alt="Salad 3" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[sa-103] Niçoise Salad</div>
                      <div className="menu-item-price">$28</div>
                    </div>
                    <div className="menu-item-desc">Seared tuna, quail eggs, haricots verts, olives</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/sa4.png`} alt="Salad 4" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[sa-104] Roasted Beetroot</div>
                      <div className="menu-item-price">$26</div>
                    </div>
                    <div className="menu-item-desc">Goat cheese mousse, candied walnuts, citrus vinaigrette</div>
                  </div>
                </div>

                <h4 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2.5rem', fontSize: '1.3rem', fontFamily: 'var(--font-serif)', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.5rem'}}>Soups</h4>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/so1.png`} alt="Soup 1" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[so-201] Wild Mushroom Velouté</div>
                      <div className="menu-item-price">$26</div>
                    </div>
                    <div className="menu-item-desc">Truffle oil drops, porcini dust</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/so2.png`} alt="Soup 2" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[so-202] Lobster Bisque</div>
                      <div className="menu-item-price">$32</div>
                    </div>
                    <div className="menu-item-desc">Cognac flamed, crème fraîche, tarragon</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/so3.png`} alt="Soup 3" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[so-203] French Onion Soup</div>
                      <div className="menu-item-price">$24</div>
                    </div>
                    <div className="menu-item-desc">Caramelized onions, gruyère crouton, beef broth</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/so4.png`} alt="Soup 4" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[so-204] Roasted Butternut Squash</div>
                      <div className="menu-item-price">$22</div>
                    </div>
                    <div className="menu-item-desc">Sage oil, toasted pumpkin seeds, crème fraîche</div>
                  </div>
                </div>

                <h4 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2.5rem', fontSize: '1.3rem', fontFamily: 'var(--font-serif)', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.5rem'}}>Main Dishes</h4>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/md1.png`} alt="Main Dish 1" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[md-301] Duck Magret a l'Orange</div>
                      <div className="menu-item-price">$85</div>
                    </div>
                    <div className="menu-item-desc">Pomme purée, charred leeks, grand marnier jus</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/md2.png`} alt="Main Dish 2" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[md-302] A5 Kobe Tenderloin</div>
                      <div className="menu-item-price">$180</div>
                    </div>
                    <div className="menu-item-desc">Wild mushrooms, asparagus, bone marrow bordelaise</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/md3.png`} alt="Main Dish 3" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[md-303] Pan-Seared Halibut</div>
                      <div className="menu-item-price">$75</div>
                    </div>
                    <div className="menu-item-desc">Lemon butter sauce, roasted fingerling potatoes</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/md4.png`} alt="Main Dish 4" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[md-304] Rack of Lamb</div>
                      <div className="menu-item-price">$90</div>
                    </div>
                    <div className="menu-item-desc">Herb crusted, ratatouille, rosemary reduction</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/md5.png`} alt="Main Dish 5" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[md-305] Truffle Risotto</div>
                      <div className="menu-item-price">$65</div>
                    </div>
                    <div className="menu-item-desc">Arborio rice, fresh black truffle shavings, parmesan</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/md6.png`} alt="Main Dish 6" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[md-306] Lobster Thermidor</div>
                      <div className="menu-item-price">$120</div>
                    </div>
                    <div className="menu-item-desc">Creamy mustard sauce, gruyère cheese crust</div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="menu-category" style={{border: 'none', padding: '0'}}>
                <h4 style={{color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.3rem', fontFamily: 'var(--font-serif)', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.5rem'}}>Desserts</h4>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/ds1.png`} alt="Dessert 1" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name" style={{color: 'var(--gold-primary)'}}>[ds-401] Passion Fruit Soufflé</div>
                      <div className="menu-item-price">$28</div>
                    </div>
                    <div className="menu-item-desc" style={{marginBottom: '0.5rem'}}>Delicately baked, exceptionally soft soufflé requiring precise temperature</div>
                    <div className="menu-item-desc" style={{color: 'var(--gold-light)'}}><strong>Pairing:</strong> Jasmine Green Tea (Hot) - Enhances the delicate floral aromas</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/ds2.png`} alt="Dessert 2" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name" style={{color: 'var(--gold-primary)'}}>[ds-402] Dark Chocolate Fondant</div>
                      <div className="menu-item-price">$26</div>
                    </div>
                    <div className="menu-item-desc" style={{marginBottom: '0.5rem'}}>Classic molten lava cake with a rich liquid chocolate center</div>
                    <div className="menu-item-desc" style={{color: 'var(--gold-light)'}}><strong>Pairing:</strong> Espresso - The bitterness perfectly cuts through the rich chocolate sweetness</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/ds3.png`} alt="Dessert 3" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name" style={{color: 'var(--gold-primary)'}}>[ds-403] Vanilla Bean Panna Cotta</div>
                      <div className="menu-item-price">$24</div>
                    </div>
                    <div className="menu-item-desc" style={{marginBottom: '0.5rem'}}>Silky smooth cream dessert infused with fresh vanilla bean</div>
                    <div className="menu-item-desc" style={{color: 'var(--gold-light)'}}><strong>Pairing:</strong> Fresh Berry Infusion - The tartness brings a refreshing balance</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/ds4.png`} alt="Dessert 4" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name" style={{color: 'var(--gold-primary)'}}>[ds-404] Caramelized Apple Tart</div>
                      <div className="menu-item-price">$25</div>
                    </div>
                    <div className="menu-item-desc" style={{marginBottom: '0.5rem'}}>Thinly sliced caramelized apples baked on a crisp pastry crust</div>
                    <div className="menu-item-desc" style={{color: 'var(--gold-light)'}}><strong>Pairing:</strong> Spiced Cinnamon Tea - Beautifully complements the apple aromas</div>
                  </div>
                </div>

                <h4 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2.5rem', fontSize: '1.3rem', fontFamily: 'var(--font-serif)', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.5rem'}}>Wines (By Bottle)</h4>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/win1.png`} alt="Wine 1" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[win-501] Château Margaux 2015</div>
                      <div className="menu-item-price">$950</div>
                    </div>
                    <div className="menu-item-desc">Bordeaux Blend, Premier Grand Cru Classé</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/win2.png`} alt="Wine 2" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[win-502] Dom Pérignon Vintage 2012</div>
                      <div className="menu-item-price">$550</div>
                    </div>
                    <div className="menu-item-desc">Champagne, vibrant acidity and toasted notes</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/win3.png`} alt="Wine 3" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[win-503] Opus One 2018</div>
                      <div className="menu-item-price">$750</div>
                    </div>
                    <div className="menu-item-desc">Napa Valley Cabernet Sauvignon</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/win4.png`} alt="Wine 4" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[win-504] Screaming Eagle 2019</div>
                      <div className="menu-item-price">$3500</div>
                    </div>
                    <div className="menu-item-desc">Oakville, Napa Valley Cabernet Sauvignon</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/win5.png`} alt="Wine 5" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name">[win-505] Sassicaia 2016</div>
                      <div className="menu-item-price">$650</div>
                    </div>
                    <div className="menu-item-desc">Bolgheri Sassicaia, Super Tuscan</div>
                  </div>
                </div>

                {/* Artisan Tea & Coffee */}
                <h4 style={{color: 'var(--text-primary)', marginBottom: '1rem', marginTop: '2.5rem', fontSize: '1.3rem', fontFamily: 'var(--font-serif)', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '0.5rem'}}>The Artisan Tea & Coffee Selection</h4>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/bev1.png`} alt="Specialty Coffee" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name" style={{color: 'var(--gold-primary)'}}>[bev-601] Specialty Coffee</div>
                      <div className="menu-item-price">$12</div>
                    </div>
                    <div className="menu-item-desc" style={{marginBottom: '0.5rem'}}>Single-Origin Espresso, Flat White, Chemex Brew</div>
                    <div className="menu-item-desc" style={{color: 'var(--gold-light)'}}><strong>Luxury Touch:</strong> Premium single-origin beans, freshly ground in-house for the perfect extraction</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/bev2.png`} alt="Fine Teas" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name" style={{color: 'var(--gold-primary)'}}>[bev-602] Fine Teas</div>
                      <div className="menu-item-price">$14</div>
                    </div>
                    <div className="menu-item-desc" style={{marginBottom: '0.5rem'}}>Silver Needle White Tea, First Flush Darjeeling, Chamomile</div>
                    <div className="menu-item-desc" style={{color: 'var(--gold-light)'}}><strong>Luxury Touch:</strong> A curated collection of rare, highly sought-after tea leaves from premium estates</div>
                  </div>
                </div>
                <div className="menu-item">
                  <div className="menu-item-img-wrapper">
                    <img src={`${BASE}assets/bev3.png`} alt="Signature Infusions" />
                  </div>
                  <div className="menu-item-content">
                    <div className="menu-item-header">
                      <div className="menu-item-name" style={{color: 'var(--gold-primary)'}}>[bev-603] Signature Infusions</div>
                      <div className="menu-item-price">$10</div>
                    </div>
                    <div className="menu-item-desc" style={{marginBottom: '0.5rem'}}>Fresh Mint, Lemon & Ginger, Lavender</div>
                    <div className="menu-item-desc" style={{color: 'var(--gold-light)'}}><strong>Luxury Touch:</strong> 100% natural, chemical-free infusions for a deeply refreshing and aromatic experience</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenuTab === 'setmenu' && (
            <div style={{maxWidth: '1100px', margin: '0 auto 4rem auto'}}>
              <div className="menu-category" style={{background: 'linear-gradient(to bottom, rgba(212,175,55,0.05), transparent)', padding: '3.5rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
                <h3 className="menu-category-title text-gold" style={{textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.2rem'}}>Curated Set Menus</h3>
                <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3.5rem', fontSize: '1rem'}}>Four distinctive culinary journeys crafted from our À La Carte selections</p>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem'}}>
                  
                  {/* Set Menu 1 */}
                  <div style={{background: 'rgba(212,175,55,0.03)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
                      <div style={{width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--gold-primary)', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.5)'}}>
                        <img src={`${BASE}assets/md2.png`} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', transform: 'scale(2.2)'}} alt="The Signature" />
                      </div>
                    </div>
                    <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                      <div style={{color: 'var(--gold-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem'}}>Menu I</div>
                      <div style={{fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.6rem'}}>The Signature Experience</div>
                    </div>
                    
                    <div style={{flexGrow: 1, padding: '0 1rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Salad</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Burrata & Heirloom Tomato</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Soup</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Wild Mushroom Velouté</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Main</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>A5 Kobe Tenderloin</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Dessert</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Dark Chocolate Fondant</span>
                      </div>
                    </div>
                    
                    <div style={{textAlign: 'center', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem'}}>
                      <div style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '1.8rem'}}>$260 <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/ pax</span></div>
                    </div>
                  </div>

                  {/* Set Menu 2 */}
                  <div style={{background: 'rgba(212,175,55,0.03)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
                      <div style={{width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--gold-primary)', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.5)'}}>
                        <img src={`${BASE}assets/md6.png`} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', transform: 'scale(2.2)'}} alt="The Ocean" />
                      </div>
                    </div>
                    <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                      <div style={{color: 'var(--gold-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem'}}>Menu II</div>
                      <div style={{fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.6rem'}}>The Ocean Journey</div>
                    </div>
                    
                    <div style={{flexGrow: 1, padding: '0 1rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Salad</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Niçoise Salad (Seared Tuna)</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Soup</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Lobster Bisque</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Main</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Lobster Thermidor</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Dessert</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Passion Fruit Soufflé</span>
                      </div>
                    </div>
                    
                    <div style={{textAlign: 'center', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem'}}>
                      <div style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '1.8rem'}}>$220 <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/ pax</span></div>
                    </div>
                  </div>

                  {/* Set Menu 3 */}
                  <div style={{background: 'rgba(212,175,55,0.03)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
                      <div style={{width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--gold-primary)', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.5)'}}>
                        <img src={`${BASE}assets/md1.png`} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', transform: 'scale(2.2)'}} alt="The Classic" />
                      </div>
                    </div>
                    <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                      <div style={{color: 'var(--gold-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem'}}>Menu III</div>
                      <div style={{fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.6rem'}}>The French Classic</div>
                    </div>
                    
                    <div style={{flexGrow: 1, padding: '0 1rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Salad</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Classic Caesar</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Soup</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>French Onion Soup</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Main</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Duck Magret a l'Orange</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Dessert</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Caramelized Apple Tart</span>
                      </div>
                    </div>
                    
                    <div style={{textAlign: 'center', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem'}}>
                      <div style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '1.8rem'}}>$180 <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/ pax</span></div>
                    </div>
                  </div>

                  {/* Set Menu 4 */}
                  <div style={{background: 'rgba(212,175,55,0.03)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
                      <div style={{width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--gold-primary)', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.5)'}}>
                        <img src={`${BASE}assets/md5.png`} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', transform: 'scale(2.2)'}} alt="Earth & Flora" />
                      </div>
                    </div>
                    <div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                      <div style={{color: 'var(--gold-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem'}}>Menu IV</div>
                      <div style={{fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.6rem'}}>Earth & Flora</div>
                    </div>
                    
                    <div style={{flexGrow: 1, padding: '0 1rem'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Salad</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Roasted Beetroot</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Soup</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Roasted Butternut Squash</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Main</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Truffle Risotto</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Dessert</span>
                        <span style={{color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.95rem'}}>Vanilla Bean Panna Cotta</span>
                      </div>
                    </div>
                    
                    <div style={{textAlign: 'center', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem'}}>
                      <div style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '1.8rem'}}>$150 <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/ pax</span></div>
                    </div>
                  </div>
                  
                </div>

                <div style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(212,175,55,0.2)', textAlign: 'center'}}>
                  <div style={{color: 'var(--gold-primary)', fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)'}}>Optional Sommelier's Wine Pairing <span style={{color: 'var(--text-primary)'}}>+$120 per person</span></div>
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic'}}>* All set menus conclude with a complimentary selection of Artisan Tea or Specialty Coffee.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Kitchen CAPEX */}
      <section id="kitchen-capex" className="section" style={{backgroundColor: 'var(--bg-lighter)'}}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Kitchen Assets & CAPEX</h2>
            <p className="section-subtitle">High-Performance & Cost-Effective European Setup</p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem'}}>
            {/* Item 1 */}
            <div style={{background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)'}}>
              <div style={{height: '200px', width: '100%', backgroundImage: 'url(/assets/kitchenassets1.png)', backgroundSize: '300% 700%', backgroundPosition: '35% 15%', backgroundColor: '#fff'}}></div>
              <div style={{padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <h4 style={{color: 'var(--gold-primary)', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0}}>1. Hot Kitchen Line (Thermal)</h4>
                  <div style={{background: 'rgba(212,175,55,0.1)', color: 'var(--gold-light)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem'}}>350 သိန်း</div>
                </div>
                <div style={{marginBottom: '1rem'}}>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>Key Equipment:</strong>
                  <ul style={{color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 1.2rem', padding: 0}}>
                    <li>Intelligent Combi Oven (10-Grid x 1)</li>
                    <li>Heavy-Duty Gas/Induction Ranges (x 4)</li>
                    <li>Commercial Griddle & Deep Fryer</li>
                  </ul>
                </div>
                <div>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>European & HACCP Standards:</strong>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.3rem 0 0 0', lineHeight: 1.5}}>• CE Certified & Energy Star (စွမ်းအင်ချွေတာရေး)<br/>• Precise temperature control (Fine dining ဟင်းပွဲများအတွက် ကွက်တိအပူချိန်ရရန်)</p>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div style={{background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)'}}>
              <div style={{height: '200px', width: '100%', backgroundImage: 'url(/assets/kitchenassets1.png)', backgroundSize: '300% 700%', backgroundPosition: '35% 33%', backgroundColor: '#fff'}}></div>
              <div style={{padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <h4 style={{color: 'var(--gold-primary)', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0}}>2. Cold Chain & Refrigeration</h4>
                  <div style={{background: 'rgba(212,175,55,0.1)', color: 'var(--gold-light)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem'}}>250 သိန်း</div>
                </div>
                <div style={{marginBottom: '1rem'}}>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>Key Equipment:</strong>
                  <ul style={{color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 1.2rem', padding: 0}}>
                    <li>Blast Chiller / Shock Freezer (x 1)</li>
                    <li>Undercounter Chillers (x 4) & Freezers (x 2)</li>
                    <li>Upright Storage Refrigerators</li>
                  </ul>
                </div>
                <div>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>European & HACCP Standards:</strong>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.3rem 0 0 0', lineHeight: 1.5}}>• HACCP Compliant Digital temperature loggers<br/>• High-grade Stainless Steel (SS304) ခိုင်ခံ့ပြီး သန့်ရှင်းရလွယ်ကူခြင်း</p>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div style={{background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)'}}>
              <div style={{height: '200px', width: '100%', backgroundImage: 'url(/assets/kitchenassets1.png)', backgroundSize: '300% 700%', backgroundPosition: '35% 50%', backgroundColor: '#fff'}}></div>
              <div style={{padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <h4 style={{color: 'var(--gold-primary)', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0}}>3. Pastry & Bakery Station</h4>
                  <div style={{background: 'rgba(212,175,55,0.1)', color: 'var(--gold-light)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem'}}>100 သိန်း</div>
                </div>
                <div style={{marginBottom: '1rem'}}>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>Key Equipment:</strong>
                  <ul style={{color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 1.2rem', padding: 0}}>
                    <li>Convection Deck Oven (x 1)</li>
                    <li>Spiral Mixer & Dough Proofer</li>
                    <li>Tabletop Chocolate Tempering Machine</li>
                  </ul>
                </div>
                <div>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>European & HACCP Standards:</strong>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.3rem 0 0 0', lineHeight: 1.5}}>• Dedicated pastry zone (FOH အချိုပွဲများအတွက် သီးသန့်စံနှုန်းမီ ထုတ်လုပ်နိုင်ရန်)</p>
                </div>
              </div>
            </div>

            {/* Item 4 */}
            <div style={{background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)'}}>
              <div style={{height: '200px', width: '100%', backgroundImage: 'url(/assets/kitchenassets1.png)', backgroundSize: '300% 700%', backgroundPosition: '35% 68%', backgroundColor: '#fff'}}></div>
              <div style={{padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <h4 style={{color: 'var(--gold-primary)', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0}}>4. Specialized Prep Equip</h4>
                  <div style={{background: 'rgba(212,175,55,0.1)', color: 'var(--gold-light)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem'}}>100 သိန်း</div>
                </div>
                <div style={{marginBottom: '1rem'}}>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>Key Equipment:</strong>
                  <ul style={{color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 1.2rem', padding: 0}}>
                    <li>Sous Vide Circulators & Vacuum Sealer</li>
                    <li>Heavy-duty Meat Mincer & Food Processors</li>
                    <li>Precision Kitchen Scales</li>
                  </ul>
                </div>
                <div>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>European & HACCP Standards:</strong>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.3rem 0 0 0', lineHeight: 1.5}}>• Modern European Fine Dining Techniques (Sous Vide ချက်ပြုတ်နည်းစနစ်များအတွက်)</p>
                </div>
              </div>
            </div>

            {/* Item 5 */}
            <div style={{background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)'}}>
              <div style={{height: '200px', width: '100%', backgroundImage: 'url(/assets/kitchenassets1.png)', backgroundSize: '300% 700%', backgroundPosition: '35% 86%', backgroundColor: '#fff'}}></div>
              <div style={{padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <h4 style={{color: 'var(--gold-primary)', fontSize: '1.2rem', fontFamily: 'var(--font-serif)', margin: 0}}>5. Stainless Steel Fabrication</h4>
                  <div style={{background: 'rgba(212,175,55,0.1)', color: 'var(--gold-light)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem'}}>100 သိန်း</div>
                </div>
                <div style={{marginBottom: '1rem'}}>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>Key Equipment:</strong>
                  <ul style={{color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 1.2rem', padding: 0}}>
                    <li>Custom Worktables with Under-shelves</li>
                    <li>Pot Sinks, Hand-wash Stations & Wall Shelves</li>
                    <li>Exhaust Hood integration extensions</li>
                  </ul>
                </div>
                <div>
                  <strong style={{color: 'var(--text-primary)', fontSize: '0.9rem'}}>European & HACCP Standards:</strong>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.3rem 0 0 0', lineHeight: 1.5}}>• HACCP Hygiene Flow (အသား၊ ငါး၊ ဟင်းသီးဟင်းရွက် Prep Area များ သီးသန့်ခွဲခြားထားမှု)</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem'}}>Total Kitchen Assets Budget</h3>
              <p style={{color: 'var(--text-secondary)', margin: 0}}>High-Performance & Cost-Effective European Setup</p>
            </div>
            
            <div style={{textAlign: 'right'}}>
              <div style={{color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem'}}>
                MMK 900 Lakhs
              </div>
              <div style={{color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', fontSize: '3.5rem', lineHeight: '1'}}>
                $22,500
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financials & Investment Breakdown */}
      <section id="financials" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Investment Overview</h2>
            <p className="section-subtitle">Total Funding Required: 4,000 သိန်း (MMK)</p>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            {/* Breakdown Bars */}
            <div style={{background: 'var(--bg-dark)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)'}}>
              <h3 style={{color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '2rem', textAlign: 'center', fontSize: '1.6rem'}}>Capital Allocation Breakdown</h3>
              
              <div style={{display: 'flex', height: '35px', borderRadius: '20px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 4px 15px rgba(0,0,0,0.5)'}}>
                <div style={{width: '63.75%', background: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.85rem', fontWeight: 'bold'}} title="Layout & Construction">63.75%</div>
                <div style={{width: '22.5%', background: '#b78846', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.85rem', fontWeight: 'bold'}} title="Kitchen Assets">22.5%</div>
                <div style={{width: '6.25%', background: '#e6c875', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.85rem', fontWeight: 'bold'}} title="Core Leadership (3 Months)">6.25%</div>
                <div style={{width: '7.5%', background: '#f5e4ab', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.85rem', fontWeight: 'bold'}} title="Working Capital & Buffer">7.5%</div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem'}}>
                <div style={{borderLeft: '4px solid #d4af37', paddingLeft: '1.2rem'}}>
                  <div style={{color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem'}}>Layout & Construction Budget</div>
                  <div style={{color: 'var(--text-primary)', fontSize: '1.6rem', fontWeight: 'bold'}}>2,550 သိန်း</div>
                </div>
                <div style={{borderLeft: '4px solid #b78846', paddingLeft: '1.2rem'}}>
                  <div style={{color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem'}}>Total Kitchen Assets Budget</div>
                  <div style={{color: 'var(--text-primary)', fontSize: '1.6rem', fontWeight: 'bold'}}>900 သိန်း</div>
                </div>
                <div style={{borderLeft: '4px solid #e6c875', paddingLeft: '1.2rem'}}>
                  <div style={{color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem'}}>Core Leadership (3 Months)</div>
                  <div style={{color: 'var(--text-primary)', fontSize: '1.6rem', fontWeight: 'bold'}}>250 သိန်း</div>
                </div>
                <div style={{borderLeft: '4px solid #f5e4ab', paddingLeft: '1.2rem'}}>
                  <div style={{color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.3rem'}}>Working Capital & Buffer</div>
                  <div style={{color: 'var(--text-primary)', fontSize: '1.6rem', fontWeight: 'bold'}}>300 သိန်း</div>
                </div>
              </div>
            </div>

            {/* ROI Projections */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
              <div style={{background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 100%)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', textAlign: 'center'}}>
                <div style={{fontSize: '3.5rem', marginBottom: '1.5rem'}}>📈</div>
                <h3 style={{color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '1rem', fontSize: '1.4rem'}}>Expected ROI</h3>
                <p style={{color: 'var(--text-secondary)', lineHeight: 1.6}}>Targeting a full return on investment within <strong style={{color: 'var(--text-primary)'}}>18 to 24 months</strong> of operation, driven by high-margin Set Menus and premium beverage pairings.</p>
              </div>
              <div style={{background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(0,0,0,0) 100%)', padding: '2.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', textAlign: 'center'}}>
                <div style={{fontSize: '3.5rem', marginBottom: '1.5rem'}}>🥂</div>
                <h3 style={{color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '1rem', fontSize: '1.4rem'}}>Target Revenue</h3>
                <p style={{color: 'var(--text-secondary)', lineHeight: 1.6}}>Projected monthly revenue of <strong style={{color: 'var(--text-primary)'}}>500 - 700 Lakhs</strong> at 60% capacity utilization, leveraging UHNWI corporate events and VIPs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Strategy */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Business Strategy</h2>
            <p className="section-subtitle">6-Month Go-to-Market & Marketing Plan</p>
            <div style={{marginTop: '1.5rem', display: 'inline-block', background: 'rgba(212,175,55,0.1)', padding: '0.8rem 1.5rem', borderRadius: '30px', border: '1px solid rgba(212,175,55,0.3)'}}>
              <strong style={{color: 'var(--gold-primary)'}}>Target Demographic:</strong> <span style={{color: 'var(--text-secondary)'}}>UHNWI, Politicians, Tycoons/Cronies, Foreigners & Embassies</span>
            </div>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-month">Month 1</div>
                <h4 style={{color: 'var(--text-primary)', marginBottom: '0.5rem'}}>Pre-Launch Hype</h4>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Teaser campaigns, exclusive influencer tastings, and PR press releases in luxury lifestyle magazines.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-month">Month 2</div>
                <h4 style={{color: 'var(--text-primary)', marginBottom: '0.5rem'}}>Grand Opening (VIP)</h4>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Invite-only launch event for Wyndham VVIPs, diplomats, and high-net-worth individuals.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-month">Month 3</div>
                <h4 style={{color: 'var(--text-primary)', marginBottom: '0.5rem'}}>Corporate Partnerships</h4>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>B2B marketing targeting multinational corporations for executive dinners and private events.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-month">Month 4-6</div>
                <h4 style={{color: 'var(--text-primary)', marginBottom: '0.5rem'}}>Sustained Growth & Loyalty</h4>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Launch 'Culinary Club' membership. Wine tasting events and seasonal menu rotations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech & Operations */}
      <section className="section" style={{backgroundColor: 'var(--bg-panel)'}}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tech & Operations</h2>
            <p className="section-subtitle">Seamless integration for maximum efficiency and premium customer experience.</p>
          </div>
          
          <div className="grid-2" style={{alignItems: 'center'}}>
            <div>
              <div style={{display: 'flex', gap: '1.5rem', marginBottom: '2rem'}}>
                <MonitorSmartphone size={40} className="text-gold" />
                <div>
                  <h3 style={{marginBottom: '0.5rem', color: 'var(--gold-primary)'}}>Next-Gen POS System</h3>
                  <p style={{color: 'var(--text-secondary)'}}>Cloud-based POS integrating inventory management, real-time sales tracking, and table turnover analytics.</p>
                </div>
              </div>
              <div style={{display: 'flex', gap: '1.5rem'}}>
                <MessageCircle size={40} className="text-gold" />
                <div>
                  <h3 style={{marginBottom: '0.5rem', color: 'var(--gold-primary)'}}>Live Chat Concierge</h3>
                  <p style={{color: 'var(--text-secondary)'}}>Website-integrated chat system allowing VVIP clients to book tables, request special arrangements, and interact directly with our concierge.</p>
                </div>
              </div>
            </div>
            
            <div style={{borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)'}}>
              <img src={images.pos} alt="POS System" style={{width: '100%', display: 'block'}} />
            </div>
          </div>
        </div>
      </section>
      {/* Investment Summary (USD) */}
      <section className="section" style={{padding: '2rem 0 0 0'}}>
        <div style={{background: 'var(--bg-lighter)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)', padding: '3rem', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--gold-primary)'}}></div>
          
          <div className="section-header" style={{marginBottom: '2rem', textAlign: 'left'}}>
            <h3 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '2rem', marginBottom: '0.5rem'}}>Executive Financial Summary</h3>
            <p style={{color: 'var(--text-secondary)'}}>Total Capital Expenditure (Exchange Rate: 1 USD = 4,000 MMK)</p>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(212,175,55,0.1)'}}>
            <div>
              <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Total Investment (MMK)</div>
              <div style={{color: '#fff', fontSize: '2.5rem', fontWeight: 'bold'}}>4,000 <span style={{fontSize: '1.2rem', color: 'var(--text-secondary)'}}>သိန်း</span></div>
            </div>
            <div style={{fontSize: '2rem', color: 'var(--gold-primary)'}}>≈</div>
            <div>
              <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Total Investment (USD)</div>
              <div style={{color: 'var(--gold-primary)', fontSize: '2.5rem', fontWeight: 'bold'}}>$100,000</div>
            </div>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
            <div style={{background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', borderLeft: '2px solid #d4af37'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem'}}>FOH Interior & Furniture</div>
              <div style={{color: '#fff', fontSize: '1.2rem', fontWeight: 'bold'}}>$50,000 <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal'}}>(2,000 သိန်း)</span></div>
            </div>
            <div style={{background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', borderLeft: '2px solid #b78846'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem'}}>BOH Interior (Kitchen)</div>
              <div style={{color: '#fff', fontSize: '1.2rem', fontWeight: 'bold'}}>$8,750 <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal'}}>(350 သိန်း)</span></div>
            </div>
            <div style={{background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', borderLeft: '2px solid #e6c875'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem'}}>Internal MEP Works</div>
              <div style={{color: '#fff', fontSize: '1.2rem', fontWeight: 'bold'}}>$5,000 <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal'}}>(200 သိန်း)</span></div>
            </div>
            <div style={{background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', borderLeft: '2px solid #f5e4ab'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem'}}>Kitchen Assets (Equipment)</div>
              <div style={{color: '#fff', fontSize: '1.2rem', fontWeight: 'bold'}}>$22,500 <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal'}}>(900 သိန်း)</span></div>
            </div>
            <div style={{background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px', borderLeft: '2px solid #a3a3a3'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem'}}>Staff & Working Capital</div>
              <div style={{color: '#fff', fontSize: '1.2rem', fontWeight: 'bold'}}>$13,750 <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal'}}>(550 သိန်း)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion / Outro */}
      <section className="section" style={{padding: '4rem 0 0 0'}}>
        <div style={{background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(10,10,10,0.8) 100%)', borderRadius: '15px', padding: '4rem', textAlign: 'center', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
          <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '2.5rem', marginBottom: '1.5rem'}}>A New Era of Luxury</h2>
          <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 2rem'}}>
            The Phoenix represents the pinnacle of culinary ambition combined with strategic business execution. By leveraging existing 5-star infrastructure, targeting the uncompromising 1%, and delivering world-class European gastronomy, we are poised to redefine Yangon's luxury dining landscape while ensuring rapid and sustainable profitability.
          </p>
          <div style={{width: '60px', height: '2px', background: 'var(--gold-primary)', margin: '0 auto 2rem'}}></div>
          <h3 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)'}}>Thank You For Your Time</h3>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px'}}>Presented by Htet Myat Oo | DCA-125</p>
        </div>
      </section>
              </div>
              <div style={{marginTop: '3rem', textAlign: 'center'}}>
                <button onClick={() => setIsAuthenticated(false)} style={{background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--text-muted)', padding: '0.5rem 1.5rem', borderRadius: '30px', cursor: 'pointer'}}>Log Out</button>
              </div>
            </div>
          )}
        </section>
      )}

      {currentPage === 'profile' && (
        <section className="section" style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          {customerUser ? (
            <div style={{width: '100%', maxWidth: '1200px', display: 'flex', gap: '2rem', marginTop: '3rem'}}>
              {/* Sidebar */}
              <div style={{width: '280px', flexShrink: 0, background: 'var(--bg-dark)', borderRadius: '15px', border: '1px solid rgba(212,175,55,0.2)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column'}}>
                <div style={{textAlign: 'center', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(212,175,55,0.1)'}}>
                  <div style={{width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-light), var(--gold-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'}}>
                    <User size={40} color="#000" />
                  </div>
                  <h3 style={{color: 'var(--gold-primary)', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem'}}>{customerUser.firstName} {customerUser.lastName || ''}</h3>
                  <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>{customerUser.email}</p>
                  <div style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', marginTop: '1rem', border: '1px solid rgba(212,175,55,0.3)'}}>
                    <Award size={14} /> VIP Gold Member
                  </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1}}>
                  <button onClick={() => setActiveProfileTab('overview')} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: activeProfileTab === 'overview' ? 'rgba(212,175,55,0.1)' : 'transparent', color: activeProfileTab === 'overview' ? 'var(--gold-primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease'}}>
                    <User size={18} /> Account Overview
                  </button>
                  <button onClick={() => setActiveProfileTab('bookings')} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: activeProfileTab === 'bookings' ? 'rgba(212,175,55,0.1)' : 'transparent', color: activeProfileTab === 'bookings' ? 'var(--gold-primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease'}}>
                    <Calendar size={18} /> My Bookings
                  </button>
                  <button onClick={() => setActiveProfileTab('rewards')} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: activeProfileTab === 'rewards' ? 'rgba(212,175,55,0.1)' : 'transparent', color: activeProfileTab === 'rewards' ? 'var(--gold-primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease'}}>
                    <Star size={18} /> Rewards & Benefits
                  </button>
                  <button onClick={() => setActiveProfileTab('settings')} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: activeProfileTab === 'settings' ? 'rgba(212,175,55,0.1)' : 'transparent', color: activeProfileTab === 'settings' ? 'var(--gold-primary)' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s ease'}}>
                    <Settings size={18} /> Preferences
                  </button>
                </div>

                <div style={{marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.1)'}}>
                  <button onClick={() => {setCustomerUser(null); setCurrentPage('home');}} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'transparent', color: '#ff6b6b', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', textAlign: 'left'}}>
                    <LogOut size={18} /> Log Out
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div style={{flex: 1, background: 'var(--bg-dark)', borderRadius: '15px', border: '1px solid rgba(212,175,55,0.2)', padding: '3rem', minHeight: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
                {activeProfileTab === 'overview' && (
                  <div style={{animation: 'fadeIn 0.5s ease'}}>
                    <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', marginBottom: '2rem', fontSize: '2rem'}}>Account Overview</h2>
                    
                    <div className="grid-3" style={{gap: '1.5rem', marginBottom: '3rem'}}>
                      <div style={{background: 'var(--bg-lighter)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)'}}>
                        <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Total Reservations</div>
                        <div style={{color: 'var(--gold-primary)', fontSize: '2.5rem', fontWeight: 'bold'}}>12</div>
                      </div>
                      <div style={{background: 'var(--bg-lighter)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)'}}>
                        <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Loyalty Points</div>
                        <div style={{color: 'var(--gold-primary)', fontSize: '2.5rem', fontWeight: 'bold'}}>4,250</div>
                      </div>
                      <div style={{background: 'var(--bg-lighter)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)'}}>
                        <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem'}}>VIP Status</div>
                        <div style={{color: 'var(--gold-primary)', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem'}}>Gold Tier</div>
                      </div>
                    </div>

                    <h3 style={{color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '0.5rem'}}>Personal Details</h3>
                    <div className="grid-2" style={{gap: '2rem'}}>
                      <div>
                        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem'}}>Full Name</p>
                        <p style={{color: '#fff', fontSize: '1.1rem'}}>{customerUser.firstName} {customerUser.lastName}</p>
                      </div>
                      <div>
                        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem'}}>Email Address</p>
                        <p style={{color: '#fff', fontSize: '1.1rem'}}>{customerUser.email}</p>
                      </div>
                      <div>
                        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem'}}>Phone Number</p>
                        <p style={{color: '#fff', fontSize: '1.1rem'}}>{customerUser.phone || '+95 9 123 456 789'}</p>
                      </div>
                      <div>
                        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.3rem'}}>Company / Organization</p>
                        <p style={{color: '#fff', fontSize: '1.1rem'}}>{customerUser.company || 'Not Specified'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'bookings' && (
                  <div style={{animation: 'fadeIn 0.5s ease'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                      <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontSize: '2rem', margin: 0}}>My Bookings</h2>
                      <button onClick={() => setCurrentPage('home')} className="btn btn-primary" style={{padding: '0.6rem 1.2rem', fontSize: '0.9rem'}}>New Reservation</button>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                      {/* Upcoming Booking */}
                      <div style={{background: 'linear-gradient(to right, rgba(212,175,55,0.05), transparent)', borderLeft: '4px solid var(--gold-primary)', padding: '1.5rem', borderRadius: '0 12px 12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                          <div style={{display: 'inline-block', background: 'var(--gold-primary)', color: '#000', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '12px', marginBottom: '0.8rem'}}>UPCOMING</div>
                          <h4 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem'}}>VIP Private Suite Dining</h4>
                          <div style={{display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Calendar size={14}/> Oct 15, 2026</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Clock size={14}/> 19:30 PM</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><User size={14}/> 4 Pax</span>
                          </div>
                        </div>
                        <button className="btn btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}>View Ticket</button>
                      </div>

                      {/* Past Booking */}
                      <div style={{background: 'var(--bg-lighter)', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)'}}>
                        <div>
                          <div style={{display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '12px', marginBottom: '0.8rem'}}>COMPLETED</div>
                          <h4 style={{color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem'}}>Main Dining Experience</h4>
                          <div style={{display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Calendar size={14}/> Sep 02, 2026</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Clock size={14}/> 20:00 PM</span>
                            <span style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><User size={14}/> 2 Pax</span>
                          </div>
                        </div>
                        <button style={{background: 'transparent', color: 'var(--gold-primary)', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>Book Again</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'rewards' && (
                  <div style={{animation: 'fadeIn 0.5s ease'}}>
                    <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', marginBottom: '2rem', fontSize: '2rem'}}>Rewards & Benefits</h2>
                    <div style={{background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(10,10,10,0.9) 100%)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--gold-primary)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h3 style={{color: '#fff', marginBottom: '0.5rem', fontSize: '1.5rem'}}>Gold Member</h3>
                        <p style={{color: 'var(--gold-light)'}}>750 points away from Platinum</p>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{fontSize: '3rem', color: 'var(--gold-primary)', fontWeight: 'bold', lineHeight: '1'}}>4,250</div>
                        <div style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Available Points</div>
                      </div>
                    </div>
                    
                    <h3 style={{color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem'}}>Your Benefits</h3>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                      <li style={{display: 'flex', alignItems: 'center', gap: '1rem'}}><Check size={18} color="var(--gold-primary)"/> Priority booking access (7 days advance)</li>
                      <li style={{display: 'flex', alignItems: 'center', gap: '1rem'}}><Check size={18} color="var(--gold-primary)"/> Complimentary welcome champagne</li>
                      <li style={{display: 'flex', alignItems: 'center', gap: '1rem'}}><Check size={18} color="var(--gold-primary)"/> Dedicated VIP Concierge line</li>
                      <li style={{display: 'flex', alignItems: 'center', gap: '1rem'}}><Check size={18} color="var(--gold-primary)"/> 10% exclusive discount on Wine Cellar purchases</li>
                    </ul>
                  </div>
                )}

                {activeProfileTab === 'settings' && (
                  <div style={{animation: 'fadeIn 0.5s ease'}}>
                    <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', marginBottom: '2rem', fontSize: '2rem'}}>Dining Preferences</h2>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                      <div>
                        <h4 style={{color: '#fff', marginBottom: '1rem'}}>Dietary Requirements</h4>
                        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut Allergy', 'Halal'].map(diet => (
                            <label key={diet} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'var(--bg-lighter)', padding: '0.5rem 1rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'}}>
                              <input type="checkbox" style={{accentColor: 'var(--gold-primary)'}} /> {diet}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 style={{color: '#fff', marginBottom: '1rem'}}>Preferred Seating</h4>
                        <select style={{width: '100%', maxWidth: '300px', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}}>
                          <option>No Preference</option>
                          <option>Window Seat (Lake View)</option>
                          <option>Private Suite</option>
                          <option>Near the Wine Cellar</option>
                        </select>
                      </div>

                      <div style={{marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid rgba(212,175,55,0.1)'}}>
                        <button className="btn btn-primary">Save Preferences</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{background: 'var(--bg-dark)', padding: '3rem', borderRadius: '15px', border: '1px solid rgba(212,175,55,0.3)', width: '100%', maxWidth: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
              <h2 style={{fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem'}}>
                {customerAuthMode === 'login' ? 'Sign In' : (signupStep === 1 ? 'Create Account' : (signupStep === 2 ? 'Contact Details' : 'Secure Account'))}
              </h2>
              
              <button type="button" onClick={handleGoogleAuth} style={{width: '100%', background: '#fff', color: '#000', border: 'none', padding: '0.8rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1.5rem'}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{width: '20px'}}/>
                Continue with Google
              </button>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)'}}>
                <div style={{flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)'}}></div>
                <span style={{fontSize: '0.8rem'}}>OR</span>
                <div style={{flex: 1, height: '1px', background: 'rgba(212,175,55,0.2)'}}></div>
              </div>

              <form onSubmit={handleCustomerAuth}>
                {customerAuthMode === 'login' ? (
                  <>
                    <input type="email" placeholder="Email Address" value={customerLoginForm.email} onChange={(e) => setCustomerLoginForm({...customerLoginForm, email: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginBottom: '1rem'}} required />
                    <input type="password" placeholder="Password" value={customerLoginForm.password} onChange={(e) => setCustomerLoginForm({...customerLoginForm, password: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', marginBottom: '1.5rem'}} required />
                    <button type="submit" style={{width: '100%', background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 100%)', color: '#000', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease'}}>Sign In</button>
                  </>
                ) : (
                  <>
                    {/* Progress Bar for Signup */}
                    <div style={{display: 'flex', gap: '0.5rem', marginBottom: '2rem'}}>
                      <div style={{flex: 1, height: '4px', background: signupStep >= 1 ? 'var(--gold-primary)' : 'rgba(212,175,55,0.2)', borderRadius: '2px'}}></div>
                      <div style={{flex: 1, height: '4px', background: signupStep >= 2 ? 'var(--gold-primary)' : 'rgba(212,175,55,0.2)', borderRadius: '2px'}}></div>
                      <div style={{flex: 1, height: '4px', background: signupStep >= 3 ? 'var(--gold-primary)' : 'rgba(212,175,55,0.2)', borderRadius: '2px'}}></div>
                    </div>

                    {signupStep === 1 && (
                      <div className="grid-2" style={{gap: '1rem', marginBottom: '1.5rem'}}>
                        <input type="text" placeholder="First Name" value={customerSignupForm.firstName} onChange={(e) => setCustomerSignupForm({...customerSignupForm, firstName: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} required />
                        <input type="text" placeholder="Last Name" value={customerSignupForm.lastName} onChange={(e) => setCustomerSignupForm({...customerSignupForm, lastName: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} required />
                      </div>
                    )}
                    {signupStep === 2 && (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                        <input type="email" placeholder="Email Address" value={customerSignupForm.email} onChange={(e) => setCustomerSignupForm({...customerSignupForm, email: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} required />
                        <input type="tel" placeholder="Phone Number (Optional)" value={customerSignupForm.phone} onChange={(e) => setCustomerSignupForm({...customerSignupForm, phone: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} />
                        <input type="text" placeholder="Company / Organization" value={customerSignupForm.company} onChange={(e) => setCustomerSignupForm({...customerSignupForm, company: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} />
                      </div>
                    )}
                    {signupStep === 3 && (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                        <input type="password" placeholder="Password" value={customerSignupForm.password} onChange={(e) => setCustomerSignupForm({...customerSignupForm, password: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} required minLength="6" />
                        <input type="password" placeholder="Confirm Password" value={customerSignupForm.confirmPassword} onChange={(e) => setCustomerSignupForm({...customerSignupForm, confirmPassword: e.target.value})} style={{width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-lighter)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none'}} required minLength="6" />
                      </div>
                    )}

                    <div style={{display: 'flex', gap: '1rem'}}>
                      {signupStep > 1 && (
                        <button type="button" onClick={() => setSignupStep(signupStep - 1)} style={{flex: 1, background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(212,175,55,0.5)', padding: '1rem', borderRadius: '8px', cursor: 'pointer'}}>Back</button>
                      )}
                      <button type="submit" style={{flex: 2, background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold-primary) 100%)', color: '#000', border: 'none', padding: '1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'}}>{signupStep === 3 ? 'Create Account' : 'Next'}</button>
                    </div>
                  </>
                )}
              </form>

              <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                {customerAuthMode === 'login' ? (
                  <p>Don't have an account? <button type="button" onClick={() => {setCustomerAuthMode('signup'); setSignupStep(1);}} style={{background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', padding: 0, fontWeight: 'bold'}}>Sign up here</button></p>
                ) : (
                  <p>Already have an account? <button type="button" onClick={() => setCustomerAuthMode('login')} style={{background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', padding: 0, fontWeight: 'bold'}}>Sign in</button></p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              <X size={40} />
            </button>
            <img src={selectedImage} alt="Enlarged Layout" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
