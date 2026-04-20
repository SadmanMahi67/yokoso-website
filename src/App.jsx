import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import JSZip from 'jszip';
import Lenis from '@studio-freight/lenis';
import { Phone, Mail, MapPin, Facebook, MessageCircle, ChevronDown, Download, ExternalLink, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ==============================
// DATA
// ==============================
const menuData = [
  // STARTERS
  { category: "Starters", name: "Prawn Hargao", desc: "Steamed prawn dumplings with tapioca starch, topped with black sesame seeds." },
  { category: "Starters", name: "Cheesy Chicken Dumpling", desc: "Savory and creamy cheesy chicken dumplings, a delightful fusion indulgence." },
  { category: "Starters", name: "Spicy Chicken Potsticker", desc: "Spicy chicken potsticker, steamed and pan-fried to perfection." },
  { category: "Starters", name: "Crispy Nori Chicken Tacos", desc: "Crispy nori with rice, savory chicken, capsicum, onion, and a creamy spicy mayo." },
  { category: "Starters", name: "Salt & Pepper Calamari", desc: "Crispy deep-fried calamari topped with fried garlic and capsicum." },
  { category: "Starters", name: "Korean Chicken", desc: "Crispy Korean fried wings with a delightful dipping sauce." },
  { category: "Starters", name: "Tom Yum Soup", desc: "Spicy and sour Thai soup with aromatic herbs, prawn and squid seasonings." },
  { category: "Starters", name: "Shanghai Chicken Salad", desc: "Chicken salad inspired by the vibrant flavors of Shanghai cuisine." },
  // SUSHI
  { category: "Sushi", name: "Golden Sakura", desc: "Prawn tempura roll topped with torched salmon, spicy mayo, and golden tempura flakes." },
  { category: "Sushi", name: "The Forbidden Crab", desc: "Crab meat and cheese roll topped with kani and a generous amount of wasabi mayo." },
  { category: "Sushi", name: "Yokoso Spider Roll", desc: "Prawn, roasted seaweed, topped with salmon, cheese, spicy mayo, garnished with tobiko." },
  { category: "Sushi", name: "Smoked Salmon Roll", desc: "Torched salmon paired with prawn tempura, rice, topped with tobiko and mayo." },
  { category: "Sushi", name: "Spicy Lava Roll", desc: "Chicken roll topped with chicken, mayo and sichuan sauce, crowned with nori crisps." },
  { category: "Sushi", name: "Alaska Roll", desc: "Deep-fried roll with sriracha sauce, crispy chips, and a torch-seared finish." },
  { category: "Sushi", name: "Ebi Tempura Roll", desc: "Rolled tempura shrimp coated with tempura powder — crispy and irresistible." },
  // MAINS
  { category: "Mains", name: "Fiery Chicken Ramen", desc: "Ramen with roasted chicken, shitake mushrooms, and boiled eggs in a bold spicy broth." },
  { category: "Mains", name: "Yokoso Special Fried Rice", desc: "Stir-fried rice with chicken, prawn, egg, vegetables, and green onions." },
  { category: "Mains", name: "Pad Thai", desc: "Rice noodles with prawn and octopus." },
  { category: "Mains", name: "Hong Kong Chicken", desc: "Deep-fried chicken legs coated with special sweet chili sauce." },
  { category: "Mains", name: "Chicken Black Pepper", desc: "Sliced chicken with capsicum in rich dark soya sauce, seasoned with black pepper." },
  { category: "Mains", name: "Sliced Beef With XO Sauce", desc: "Sliced beef bathed in a special XO sauce — a Cantonese classic." },
  { category: "Mains", name: "Beef Bulgogi", desc: "Spicy gochujang-infused dry curry beef, pan-fried to perfection." },
  { category: "Mains", name: "Steamed Sea Bass with Lemon Sauce", desc: "Whole steamed sea bass served with the house special lemon sauce." },
  { category: "Mains", name: "Stir-Fried Morning Glory", desc: "Sautéed mushrooms and kangkong with various sauces and flavorful seasonings." },
  // DRINKS
  { category: "Drinks", name: "Mineral Water", desc: "Refreshing bottled mineral water." },
  { category: "Drinks", name: "Soft Drinks", desc: "Selection of cold soft drinks." },
  // DESSERTS
  { category: "Desserts", name: "Mango Sticky Rice with Coconut Ice Cream", desc: "Sweet sticky rice, fresh mango, and rich coconut ice cream." },
  { category: "Desserts", name: "Crispy Chips With Ice Cream", desc: "Warm crispy chips served with cool vanilla ice cream." },
  { category: "Desserts", name: "Fried Ice Cream", desc: "Warm crispy shell encasing cold ice cream — an irresistible contrast." },
];

const featuredData = [
  { 
    src: "assets/food/476836624_606404228842821_3138692407284552597_n.jpg", 
    category: "Signature Ramen", 
    name: "Fiery Chicken Ramen", 
    desc: "Our masterfully crafted ramen featuring tender roasted chicken, earthy shiitake mushrooms, and soft-boiled eggs, perfectly balanced in a bold, slow-simmered spicy broth." 
  },
  { 
    src: "assets/food/470177064_569939242489320_8570242204040522190_n.jpg", 
    category: "Dim Sum Classics", 
    name: "Nori Wrapped Siu Mai", 
    desc: "A luxurious twist on a timeless classic. Delicately steamed siu mai wrapped in premium roasted nori, crowned with flying fish roe for a subtle oceanic burst." 
  },
  { 
    src: "assets/food/482212916_615356427951585_2626863194105595389_n.jpg", 
    category: "Chef's Special Rolls", 
    name: "Golden Sakura Roll", 
    desc: "A stunning prawn tempura roll adorned with torched salmon and a drizzle of our house spicy mayo, finished with delicate golden crisp tempura flakes."
  }
];

// ==============================
// SAKURA CANVAS
// ==============================
const SakuraCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const maxPetals = window.innerWidth < 768 ? 7 : 14;
    const petals = [];

    const createPetal = (isInitial = false) => {
      const isLeft = Math.random() > 0.5;
      const x = isInitial 
        ? Math.random() * width 
        : (isLeft ? Math.random() * (width * 0.3) : width * 0.7 + Math.random() * (width * 0.3));
      const y = isInitial ? Math.random() * height : -20;
      const size = 4 + Math.random() * 7;
      
      return {
        x,
        y,
        size,
        speedY: 0.5 + Math.random() * 1.5,
        speedX: -0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.05,
        opacity: (size < 6) ? 0.25 : 0.55,
        color: Math.random() > 0.5 ? '#C0392B' : '#8B0000',
        waveOffset: Math.random() * 100,
      };
    };

    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    const drawPetal = (p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(p.size, -p.size, p.size * 1.5, 0);
      ctx.quadraticCurveTo(p.size, p.size, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const update = () => {
      // Pause if tab is hidden
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Reduce activity during scroll to prioritize frame rate
      const activePetals = window.isScrolling ? petals.slice(0, Math.floor(maxPetals / 2)) : petals;

      activePetals.forEach((p, i) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.05 + p.waveOffset) * 0.5;
        p.angle += p.spin;

        if (p.y > height + 20 || p.x < -20 || p.x > width + 20) {
          activePetals[i] = createPetal();
        } else {
          drawPetal(p);
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Track scroll state globally for canvas throttling
    const handleScrollState = () => {
      window.isScrolling = true;
      clearTimeout(window.scrollEndTimer);
      window.scrollEndTimer = setTimeout(() => {
        window.isScrolling = false;
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScrollState, { passive: true });

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        update();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 pointer-events-none z-[9999]" />;
};

// ==============================
// UI COMPONENTS
// ==============================
const Button = ({ children, variant = 'filled', className = '', ...props }) => {
  const baseOuter = 'btn-magnetic btn-container px-6 py-3 rounded-full text-sm tracking-wide transition-all duration-300';
  
  if (variant === 'filled') {
    return (
      <button className={`${baseOuter} bg-torii border border-torii text-ivory btn-glow ${className}`} {...props}>
        <span className="btn-sliding-layer bg-crimson"></span>
        <span className="btn-content font-sans">{children}</span>
      </button>
    );
  } else {
    // outline
    return (
      <button className={`${baseOuter} bg-transparent border border-ivory text-ivory hover:text-torii ${className}`} {...props}>
        <span className="btn-sliding-layer bg-ivory"></span>
        <span className="btn-content font-sans">{children}</span>
      </button>
    );
  }
};

const SectionTitle = ({ title, showUnderline = true, underlineColor = "text-torii" }) => (
  <div className="mb-16 text-center md:text-left">
    <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-ivory inline-block relative z-10">
      {title}
      {showUnderline && (
        <svg className={`absolute -bottom-4 left-0 w-full h-4 ${underlineColor} z-[-1] opacity-80`} viewBox="0 0 100 20" preserveAspectRatio="none">
          <path d="M0,10 Q50,20 100,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </h2>
  </div>
);

// ==============================
// SECTIONS
// ==============================
const navLinks = [
  { label: 'Home',     id: 'hero'    },
  { label: 'Menu',     id: 'menu'    },
  { label: 'Gallery',  id: 'dishes'  },
  { label: 'About Us', id: 'about'   },
  { label: 'Reviews',  id: 'reviews' },
  { label: 'Contact',  id: 'contact' },
];

const scrollToSection = (id) => {
  const target = document.getElementById(id);
  if (target && window.lenis) {
    window.lenis.scrollTo(target, {
      offset: -80,     // account for fixed navbar height
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  }
};

// Utility function for every float animation
const startFloat = (selector, amplitude, duration, delay) => {
  gsap.utils.toArray(selector).forEach((el, i) => {
    gsap.to(el, {
      y: -amplitude,
      duration: duration + (i * 0.4),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: delay + (i * 0.25),
      overwrite: 'auto',  // prevents conflicts with entrance animations
    });
  });
};

const Navbar = () => {
  const navRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: { className: 'nav-scrolled', targets: navRef.current },
        onUpdate: (self) => {
          if (self.isActive && self.direction === 1) {
             gsap.to(navRef.current, { 
               backgroundColor: 'rgba(13, 10, 18, 0.92)', 
               borderColor: 'rgba(139, 0, 0, 0.25)', 
               backdropFilter: 'blur(24px)', 
               padding: '10px 32px',
               duration: 0.4,
               ease: 'power2.out'
             });
          } else if (!self.isActive) {
             gsap.to(navRef.current, { 
               backgroundColor: 'transparent', 
               borderColor: 'transparent', 
               backdropFilter: 'blur(0px)', 
               padding: '18px 32px',
               duration: 0.4,
               ease: 'power2.out'
             });
          }
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100] flex justify-center pt-6 px-4 pointer-events-none">
        <nav ref={navRef} className="pointer-events-auto flex items-center justify-between px-6 py-4 rounded-full border border-transparent w-[95%] max-w-5xl transition-all duration-300 relative z-10">
          <div className="text-2xl font-cormorant italic text-ivory tracking-widest leading-none">YŌKOSO</div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-sans font-light tracking-wide text-ivory uppercase">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => scrollToSection(link.id)} className="link-lift">
                {link.label}
              </button>
            ))}
          </div>
          
          <div className="hidden md:block">
            <a href="https://wa.me/8801841965676" target="_blank" rel="noreferrer">
              <button className="bg-torii px-6 py-2.5 rounded-full text-ivory text-sm font-sans tracking-wide transition-all shadow-[0_0_15px_rgba(192,57,43,0.4)] hover:scale-105 hover:bg-hover">
                WhatsApp
              </button>
            </a>
          </div>

          <button className="md:hidden text-ivory" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className="space-y-1.5">
              <div className={`w-6 h-0.5 bg-ivory transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-ivory ${mobileOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-ivory transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </nav>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[110] bg-[#0D0A12] w-full h-full flex flex-col items-center justify-center p-6 space-y-10 text-ivory">
          <div className="absolute top-6 right-6"></div>
          {navLinks.map(link => (
            <button key={link.id} onClick={() => { scrollToSection(link.id); setMobileOpen(false); }} className="text-4xl font-cormorant italic">
              {link.label}
            </button>
          ))}
          <a href="https://wa.me/8801841965676" className="mt-8 px-8 py-3 bg-torii text-ivory rounded-full font-sans shadow-lg">WhatsApp Us</a>
        </div>
      )}
    </>
  );
};

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-anim', {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        ease: 'power3.out',
        duration: 1.2,
        delay: 0.3,
        onComplete: () => {
          // A. Hero logo float - starts after hero entrance completes
          startFloat('.hero-logo-img', 5, 3.5, 0);
        }
      });
      gsap.from('.hero-line', {
        scaleY: 0,
        transformOrigin: 'top',
        ease: 'power2.out',
        duration: 1.5,
        delay: 1.2
      });
      gsap.to('.hero-scroll', {
        y: 8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        duration: 1.5
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="relative h-[100dvh] w-full flex items-center justify-center px-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/interior/475778909_599017436248167_6890027126558187800_n.jpg" 
          alt="Yokoso Ceremony" 
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchpriority="high"
        />
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #000 10%, transparent 60%)' }}
        ></div>
        <div className="absolute inset-0 bg-[#000]/20 pointer-events-none"></div>
      </div>

      {/* Content Center */}
      <div className="relative z-20 flex flex-col items-center text-center mt-12 w-full max-w-2xl">
        
        <div className="hero-anim relative mb-6">
          <img 
            src="/assets/logo/yokoso logo no bg.png" 
            alt="YOKOSO Symbol" 
            className="w-40 md:w-48 h-auto object-contain mx-auto hero-logo-img" 
            loading="eager"
          />        </div>

        <h1 className="hero-anim font-playfair font-normal text-4xl md:text-6xl text-[#FCFCFC] mb-4 tracking-[0.2em] uppercase">
          YŌKOSO
        </h1>

        <p className="hero-anim font-cormorant italic text-[#FCFCFC] text-xl md:text-2xl mb-12 leading-snug tracking-wide">
          Where every meal is a ceremony.
        </p>

        <div className="hero-anim flex flex-wrap justify-center gap-4">
          <button onClick={() => scrollToSection('menu')}><Button variant="outline">View Menu</Button></button>
          <a href="https://wa.me/8801841965676" target="_blank" rel="noreferrer"><Button variant="filled">WhatsApp Us</Button></a>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="hero-anim absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 opacity-70">
        <div className="hero-scroll w-[1px] h-20 bg-gradient-to-b from-[#FCFCFC] to-transparent"></div>
      </div>
    </section>
  );
};

// Flower icon for menu
const FlowerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#C0392B" stroke="#C0392B" strokeWidth="1" className="inline-block mt-1 flex-shrink-0">
    <path d="M12 2C9 5 8 9 12 12C16 9 15 5 12 2Z"/>
    <path d="M12 22C15 19 16 15 12 12C8 15 9 19 12 22Z"/>
    <path d="M22 12C19 15 15 16 12 12C15 8 19 9 22 12Z"/>
    <path d="M2 12C5 9 9 8 12 12C9 16 5 15 2 12Z"/>
    <circle cx="12" cy="12" r="2" fill="#8B0000"/>
  </svg>
);

const Menu = () => {
  const [activeTab, setActiveTab] = useState('Sushi');
  const tabs = ['Starters', 'Sushi', 'Mains', 'Drinks', 'Desserts'];

  const [downloading, setDownloading] = useState(false);

  const handleMenuDownload = async () => {
    setDownloading(true);
    try {
      const menuFiles = [
        'assets/menu/main menu-01.jpg.jpeg',
        'assets/menu/main menu-02.jpg.jpeg',
        'assets/menu/shusi menu.jpg.jpeg',
      ];

      const zip = new JSZip();
      const folder = zip.folder('Yokoso-Menu');

      // Fetch each image and add to zip
      await Promise.all(
        menuFiles.map(async (path) => {
          const response = await fetch(path);
          const blob = await response.blob();
          const filename = path.split('/').pop(); // get just the filename
          folder.file(filename, blob);
        })
      );

      // Generate zip and trigger download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Yokoso-Menu.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const filteredMenu = menuData.filter(item => item.category === activeTab);

  return (
    <section id="menu" className="py-32 px-6 md:px-12 bg-[#0A0A0A] section-divider">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Our Menu" />
        
        {/* Tabs & Download Button Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-ivory/10 pb-4">
          <div className="flex flex-wrap gap-8 font-sans text-sm uppercase tracking-widest">
            {tabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`transition-colors relative pb-4 ${activeTab === tab ? 'text-torii' : 'text-ash hover:text-ivory'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-torii"></div>}
              </button>
            ))}
          </div>

          <button 
            onClick={handleMenuDownload}
            disabled={downloading}
            className={`btn-container group border border-torii/50 bg-transparent text-ivory rounded-full px-5 py-2.5 text-sm font-sans tracking-wide transition-all duration-300 hover:scale-[1.02] hover:border-torii mb-2 md:mb-0 w-full md:w-auto flex justify-center ${downloading ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <div className="btn-slide-left bg-torii"></div>
            <div className="btn-content flex items-center justify-center gap-2">
              <Download className={`w-4 h-4 transition-transform duration-300 ${downloading ? '' : 'group-hover:translate-y-0.5'}`} />
              <span>{downloading ? "Preparing..." : "Download Menu"}</span>
            </div>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item, i) => (
            <div 
              key={`${item.name}-${i}`} 
              className="group relative menu-card p-7 transition-colors flex items-start gap-4 overflow-hidden"
            >
              {/* Vertical red border reveal */}
              <div className="absolute left-0 top-0 w-1 bg-torii h-1 group-hover:h-full transition-all duration-500 ease-out z-10 opacity-0 group-hover:opacity-100"></div>
              
              <FlowerIcon />
              <div>
                <h3 className="font-playfair item-name text-[1.2rem] text-ivory mb-2">{item.name}</h3>
                <p className="font-sans item-desc font-light text-[0.9rem] text-ash leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const galRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.feature-left', {
        scrollTrigger: { trigger: galRef.current, start: 'top 70%' },
        x: -50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.2
      });
      gsap.from('.feature-right', {
        scrollTrigger: { trigger: galRef.current, start: 'top 70%' },
        x: 50, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out', stagger: 0.2
      });

      // B. Featured dish food images float - starts when section enters viewport
      ScrollTrigger.create({
        trigger: '#dishes',
        start: 'top 70%',
        once: true,
        onEnter: () => startFloat('.featured-dish-image', 6, 4.0, 0.2),
      });
    }, galRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="dishes" ref={galRef} className="py-24 px-6 md:px-12 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Featured Dishes" underlineColor="text-[#C0392B]" />
        
        <div className="flex flex-col mt-12">
          {featuredData.map((item, i) => {
            const isReverse = i % 2 !== 0; 
            return (
              <React.Fragment key={i}>
                <div className={`flex flex-col items-center gap-12 md:flex-row ${isReverse ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Image Container */}
                  <div className={`w-full md:w-[45%] flex justify-center ${isReverse ? 'feature-right' : 'feature-left'}`}>
                    <div 
                      className="relative w-full max-w-[420px] h-[500px] overflow-hidden border border-[#C0392B]/20 featured-dish-image-container"
                      style={{ 
                         borderRadius: '160px 160px 20px 20px',
                         boxShadow: '0 0 40px rgba(192, 57, 43, 0.08)' 
                      }}
                    >
                      <img 
                        src={`/${item.src}`} 
                        loading="lazy"
                        decoding="async"
                        alt={item.name} 
                        className="featured-dish-image w-full h-full object-cover transition-transform duration-700 hover:scale-[1.05]"
                      />
                    </div>
                  </div>

                  {/* Text Container */}
                  <div className={`w-full md:w-[50%] flex flex-col items-center md:items-start text-center md:text-left justify-center ${isReverse ? 'feature-left' : 'feature-right'}`}>
                    <span className="font-sans font-medium tracking-[0.2em] uppercase text-[#C0392B] text-sm mb-4">{item.category}</span>
                    <h3 className="font-cormorant text-4xl md:text-5xl text-ivory italic mb-6 leading-tight">{item.name}</h3>
                    <p className="font-sans font-light text-ash leading-relaxed text-lg max-w-md md:max-w-none">
                      {item.desc}
                    </p>
                  </div>
                  
                </div>
                
                {/* Separator */}
                {i < featuredData.length - 1 && (
                  <div className="w-[80%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C0392B]/30 to-transparent my-10"></div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
};

const About = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: 'top 75%',
          once: true,
        }
      });
      
      aboutTl.from('.about-text > *', {
        y: 40, 
        opacity: 0, 
        duration: 1.2, 
        ease: 'power3.out', 
        stagger: 0.15
      });
    }, aboutRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={aboutRef} 
      className="relative py-40 border-y border-[#0B2414] overflow-hidden"
    >
      
      {/* Full Bleed Background */}
      <div className="absolute inset-0 z-0 about-image-container">
        <img 
          src="/assets/interior/470802455_568732722609972_7602261850674754022_n.jpg" 
          loading="lazy"
          decoding="async"
          alt="Yokoso Interior" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85))' }}></div>
      </div>

      {/* Background Watermark (Centered) */}
      <img 
        src="/assets/logo/yokoso logo no bg.png" 
        loading="lazy"
        decoding="async"
        className="about-watermark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] h-auto opacity-[0.02] pointer-events-none object-contain z-0" 
        alt=""
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center text-center about-text">
         
         <h2 className="font-playfair text-5xl md:text-6xl text-ivory mb-8 leading-tight">
           Tradition Meets Flavour
         </h2>
         
         {/* Gold Accent Rule  */}
         <div className="w-24 h-[1px] bg-[#C9A84C] mb-10"></div>
         
         <p className="font-sans font-light text-ash text-lg md:text-xl max-w-[800px] leading-[1.8] mb-12">
           YŌKOSO — meaning 'Welcome' in Japanese — brings authentic Japanese cuisine to the heart of Sylhet. Located on the 2nd Floor of Al Madani Tower, Mirboxtula, we offer an experience where tradition meets flavour in every dish. Whether you're joining us for an intimate dinner or a celebration, our chefs craft dishes using the finest ingredients to ensure every meal is memorable.
         </p>
         
         {/* Ghost CTA */}
         <a 
           href="https://share.google/P5XQidfZ3sap3kc1k" 
           target="_blank" 
           rel="noreferrer"
           className="inline-block border border-ivory/50 text-ivory bg-transparent hover:bg-[#0B2414] hover:border-[#0B2414] px-10 py-3.5 rounded-full font-sans tracking-wide transition-all duration-300"
         >
           Get Directions
         </a>
      </div>
    </section>
  );
};

const reviewsData = [
  {
    name: "Dibyajyoti D.",
    stars: 5,
    text: "Highly recommended. Their sushi tastes great and the service is top notch.",
    featured: false
  },
  {
    name: "Anisur F.",
    stars: 5,
    text: "What an excellent experience. The vibes are great and the Dongbei Sui Mai chicken were perfect.",
    featured: false
  },
  {
    name: "Rafid H.",
    stars: 5,
    text: "Undoubtedly one of the best restaurants in Sylhet. Premium food quality at a very reasonable price. The ambiance is something you won't find anywhere else in the city.",
    featured: true
  },
  {
    name: "Syed M.",
    stars: 5,
    text: "Exceptional Japanese cuisine. The atmosphere was delightful and the service was truly top-notch.",
    featured: false
  },
  {
    name: "Guest",
    stars: 5,
    text: "A great place for pan-Asian cuisine. Their ramen and bento boxes are too good. Highly recommended.",
    featured: false
  }
];

const GuestExperience = () => {
  const compRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Section header reveal
      const headerWords = document.querySelectorAll('.review-header-word');
      if (headerWords.length > 0) {
        gsap.from(headerWords, {
          scrollTrigger: { trigger: compRef.current, start: "top 80%" },
          y: 30, opacity: 0, stagger: 0.07, ease: "power3.out", duration: 0.8
        });
      }

      gsap.from('.review-rating-badge', {
        scrollTrigger: { trigger: compRef.current, start: "top 80%" },
        scale: 0.9, opacity: 0, ease: "power3.out", duration: 0.8, delay: (headerWords.length * 0.07) + 0.2
      });

      // 5. Rating badge counter animation
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 43,
        scrollTrigger: { trigger: compRef.current, start: "top 80%" },
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          const el = document.querySelector('.review-counter');
          if (el) el.textContent = Math.round(obj.val) + " Reviews";
        }
      });

      // 2. Card entrance architecture
      const allCards = gsap.utils.toArray('.review-card');
      const normalCards = allCards.filter(c => !c.classList.contains('featured-card'));
      const featuredCard = allCards.find(c => c.classList.contains('featured-card'));

      // Initial States
      gsap.set(normalCards, { y: 50, opacity: 0, scale: 0.96 });
      if (featuredCard) gsap.set(featuredCard, { x: -60, opacity: 0, scale: 0.96 });

      ScrollTrigger.create({
        trigger: ".review-grid",
        start: "top 80%",
        onEnter: () => {
          gsap.to(allCards, {
            x: 0, y: 0, opacity: 1, scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            onComplete: () => {
              // Review cards float - starts when section enters viewport
              startFloat('.review-card', 7, 2.8, 0);
            }
          });

          // Secondary featured border reveal
          if (featuredCard) {
            const featBorder = featuredCard.querySelector('.featured-border');
            if (featBorder) {
              gsap.to(featBorder, {
                height: "100%", duration: 0.6, ease: "power2.out", delay: 0.5
              });
            }
          }
        },
        once: true
      });

    }, compRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="reviews" ref={compRef} className="py-32 bg-[#0A0A0A] overflow-hidden relative guest-experience-sec">
      {/* Background radial gradient glow removed */}
      <div className="absolute inset-0 pointer-events-none z-0"></div>
      
      <div className="max-w-6xl mx-auto px-6 mb-20 relative z-10 flex flex-col items-center text-center">
        {/* Brush stroke instead of TESTIMONIALS */}
        <svg viewBox="0 0 80 20" className="w-[80px] h-[20px] fill-[#8B0000] mb-6 inline-block">
           <path d="M5,10 Q20,5 40,12 T75,8 Q60,15 40,8 T5,10 Z"/>
        </svg>

        <h2 className="font-playfair text-5xl md:text-6xl text-ivory mb-6 leading-tight flex flex-wrap justify-center overflow-hidden">
          {"What Our Guests Say".split(" ").map((word, i) => (
            <span key={i} className="inline-block review-header-word mr-[0.25em] whitespace-pre">{word}</span>
          ))}
        </h2>
        
        <p className="font-cormorant italic text-[#8A7F7F] text-[1.2rem] mb-6">
          Voices from our table — real guests, real experiences.
        </p>

        <div className="font-mono text-[#C0392B] text-[0.85rem] review-rating-badge inline-flex items-center gap-2 px-4 py-2 bg-[#1E0A0A] rounded-full border border-[rgba(192,57,43,0.2)]">
          <span className="text-[1rem]">⭐</span>
          <span>92% recommend · <span className="review-counter">0 Reviews</span></span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 review-grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start grid-flow-row-dense">
          {reviewsData.map((review, idx) => {
            const isMiddleCol = idx === 1; // Since idx 1 falls in col 2, we offset it manually
            const isFeatured = review.featured;
            
            return (
              <div 
                key={idx}
                className={`w-full group review-card-container ${isMiddleCol ? 'lg:mt-[40px]' : ''} ${isFeatured ? 'md:col-span-2 featured-card' : 'lg:col-span-1'}`}
              >
                <div className="relative review-card p-8 overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:-translate-y-[6px]">
                  
                  {/* Giant Decorative Quote */}
                  <div className="absolute top-4 left-6 font-cormorant italic quote-mark text-[5rem] opacity-[0.35] leading-none select-none pointer-events-none transition-opacity duration-[400ms] group-hover:opacity-60">"</div>

                  {/* Stars */}
                  <div className="flex text-[#C0392B] mb-6 text-lg relative z-10 gap-[2px]">
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="font-playfair italic text-[#F5F0EC] review-text text-[1.05rem] leading-[1.75] mb-10 relative z-10 min-h-[4rem]">
                    {review.text}
                  </p>

                  {/* Bottom Element: Divider + Name */}
                  <div className="mt-auto relative z-10 w-full flex flex-col items-start pt-2">
                    <div className="h-[1px] w-[60px] bg-gradient-to-r from-[#8B0000] to-transparent mb-3"></div>
                    <div className="font-sans uppercase text-ash reviewer-name text-xs tracking-[0.12em]">
                      {review.name}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modern Pill CTA */}
      <div className="flex justify-center mt-16 relative z-10">
         <a 
           href="https://search.google.com/local/writereview?placeid=ChIJo_dI1x_0VjcRk2S6-Qh0h7g" 
           target="_blank" 
           rel="noreferrer"
           className="btn-container group bg-[#C0392B] text-ivory rounded-full px-8 py-4 font-sans uppercase tracking-[0.1em] text-sm overflow-hidden flex items-center transition-transform duration-300 hover:scale-[1.03]"
         >
           <div className="btn-sliding-layer bg-[#E74C3C]"></div>
           <div className="btn-content flex items-center gap-3">
             <span>Leave a Review on Google</span>
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
               <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
             </svg>
           </div>
         </a>
      </div>

    </section>
  );
};


const Contact = () => {
  const contactRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const contactTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 75%',
          once: true,
        }
      });

      contactTl
        .from('.contact-card', { 
          y: 40, opacity: 0, duration: 0.7, 
          stagger: 0.15, ease: 'power3.out' 
        })
        .from('.contact-title', { 
          y: 20, opacity: 0, duration: 0.5, 
          ease: 'power2.out' 
        }, '-=0.4');

      // Floating animation starts AFTER entrance completes
      contactTl.call(() => {
        startFloat('.contact-form-card', 5, 3.8, 0.5);
      });
    }, contactRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={contactRef} className="relative py-32 overflow-hidden border-t border-[#9CAF88]/10" style={{ backgroundColor: '#000' }}>
      
      {/* Atmosphere Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/interior/475778909_599017436248167_6890027126558187800_n.jpg" 
          loading="lazy"
          decoding="async"
          alt="Yokoso Atmosphere" 
          className="w-full h-full object-cover object-center opacity-30"
          style={{ filter: 'grayscale(100%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#051108]/90 via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
      </div>

      {/* Subtle Logo Watermark */}
      <div className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center opacity-5 pointer-events-none z-0">
        <img 
          src="/assets/logo/yokoso logo no bg.png" 
          loading="lazy"
          decoding="async"
          alt="" 
          className="w-full max-w-[600px] object-contain" 
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="contact-title">
          <SectionTitle title="Begin the Ceremony" underlineColor="text-[#9CAF88]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-12 mt-16 items-center">
          
          {/* Left Column (The Details) */}
          <div className="contact-card flex flex-col gap-12 text-left">
            
            {/* Opening Hours */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                 <svg className="w-6 h-6 text-[#9CAF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                   <circle cx="12" cy="12" r="10" />
                   <path d="M12 6v6l4 2" />
                 </svg>
                 <h3 className="font-cormorant text-2xl md:text-3xl text-ivory italic">Opening Hours</h3>
              </div>
              <div className="font-sans font-light text-ash tracking-wide space-y-1 ml-10">
                 <p>Everyday: 12:00 PM – 11:30 PM</p>
              </div>
            </div>

            {/* Visit */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                 <MapPin className="w-6 h-6 text-[#9CAF88]" strokeWidth={1} />
                 <h3 className="font-cormorant text-2xl md:text-3xl text-ivory italic">Location</h3>
              </div>
              <div className="font-sans font-light text-ash tracking-wide space-y-1 ml-10">
                 <p>2nd Floor, Al Madani Tower</p>
                 <p>Mirboxtula, Sylhet</p>
                 <p>Bangladesh, 3100</p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                 <Phone className="w-6 h-6 text-[#9CAF88]" strokeWidth={1} />
                 <h3 className="font-cormorant text-2xl md:text-3xl text-ivory italic">Reservations</h3>
              </div>
              <div className="font-sans font-light text-ash tracking-wide space-y-1 ml-10">
                 <p className="font-mono text-ivory/80">01841-965676</p>
              </div>
            </div>

          </div>

          {/* Thin vertical line divider */}
          <div className="hidden md:block w-[1px] h-[80%] bg-ivory/10 mt-8"></div>
          {/* Horizontal line for mobile */}
          <div className="md:hidden w-full h-[1px] bg-ivory/10 my-4"></div>

          {/* Right Column (The Form in Glassmorphism Container) */}
          <div className="contact-form-card flex flex-col w-full max-w-md mx-auto md:mx-0 p-8 md:p-12 bg-[rgba(0,0,0,0.6)] backdrop-blur-[12px] border border-[#9CAF88]/10 rounded-[2rem]">
             <h3 className="font-cormorant text-3xl text-ivory italic mb-8">Send an Inquiry</h3>
             <form action="mailto:yokoso.syl@gmail.com" method="post" encType="text/plain" className="w-full space-y-10 font-sans text-sm">
               
               <div className="relative">
                 <input type="text" placeholder="Your Name" className="w-full bg-transparent border-b border-[rgba(255,255,255,0.3)] text-ivory px-0 py-3 focus:outline-none focus:border-crimson transition-colors placeholder:text-ivory/70" required/>
               </div>
               
               <div className="relative">
                 <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-[rgba(255,255,255,0.3)] text-ivory px-0 py-3 focus:outline-none focus:border-crimson transition-colors placeholder:text-ivory/70" required/>
               </div>
               
               <div className="relative">
                 <textarea placeholder="Message" className="w-full bg-transparent border-b border-[rgba(255,255,255,0.3)] text-ivory px-0 py-3 h-24 resize-none focus:outline-none focus:border-crimson transition-colors placeholder:text-ivory/70" required></textarea>
               </div>
               
               <div className="flex justify-center pt-4">
                 <button 
                   type="submit" 
                   className="inline-block border border-ivory/40 text-ivory bg-transparent hover:bg-crimson hover:border-crimson px-10 py-3.5 rounded-full font-sans tracking-wide transition-all duration-300 w-full md:w-auto"
                 >
                   Send Message
                 </button>
               </div>
             </form>
          </div>

        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.footer-col', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%'
        },
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: 'power3.out',
        duration: 1
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="border-t-2 border-torii rounded-t-[2.5rem] pt-24 pb-12 relative z-30 overflow-hidden">
      {/* Radial Background Glow removed */}
      <div className="absolute inset-x-0 top-0 h-[300px] pointer-events-none z-0"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          
          {/* Column 1 - Brand */}
          <div className="footer-col flex flex-col items-start text-left">
            <div className="font-cormorant italic text-[2rem] text-ivory tracking-[0.2em] mb-4">YŌKOSO</div>
            <p className="font-sans font-light text-ash text-[0.9rem] mb-6">Where every meal is a ceremony.</p>
            
            <div className="font-mono text-[0.8rem] text-torii flex items-center gap-2 mb-4">
              <span>⭐ 92% recommend · 43 Reviews</span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-2 h-2 rounded-full bg-[#6BCB77] status-dot shadow-[0_0_8px_#6BCB77]"></div>
              <span className="font-mono text-[0.75rem] text-[#6BCB77] tracking-[0.15em] uppercase">Now Serving</span>
            </div>
          </div>

          {/* Column 2 - Explore */}
          <div className="footer-col flex flex-col border-l border-torii/30 pl-8 md:pl-12">
            <h4 className="font-sans font-medium text-[0.75rem] text-ash tracking-[0.2em] uppercase mb-8">Explore</h4>
            <div className="flex flex-col gap-4 font-sans font-light text-ivory text-sm">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="hover:text-torii hover:-translate-y-px transition-all duration-300 w-fit text-left">
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3 - Connect */}
          <div className="footer-col flex flex-col border-l border-torii/30 pl-8 md:pl-12">
            <h4 className="font-sans font-medium text-[0.75rem] text-ash tracking-[0.2em] uppercase mb-8">Connect</h4>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <a href="https://www.facebook.com/yokosobd" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ivory hover:text-torii transition-colors text-sm font-sans font-light">
                  <Facebook size={18} strokeWidth={1.5} />
                  <span>Facebook</span>
                </a>
                <a href="https://m.me/yokosobd" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ivory hover:text-torii transition-colors text-sm font-sans font-light">
                  <MessageCircle size={18} strokeWidth={1.5} />
                  <span>Messenger</span>
                </a>
                <a href="https://wa.me/8801841965676" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ivory hover:text-torii transition-colors text-sm font-sans font-light">
                  <Phone size={18} strokeWidth={1.5} />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="mt-4">
                <p className="font-sans font-light text-ash text-[0.85rem] leading-relaxed">
                  2nd Floor, Al Madani Tower,<br />
                  Mirboxtula, Sylhet
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Base Bar */}
        <div className="mt-20 pt-8 border-t border-crimson/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-sans text-[0.8rem] text-[#555]">
            © {new Date().getFullYear()} YŌKOSO. All rights reserved.
          </div>
          <div className="font-sans text-[0.8rem] text-ash">
             <a href="mailto:yokoso.syl@gmail.com" className="hover:text-torii transition-colors">yokoso.syl@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  // Initialize global performance flags
  useEffect(() => {
    window.isScrolling = false;
  }, []);

  useEffect(() => {
    // INITIALIZE LENIS
    const lenis = new Lenis({
      duration: 1.4,           // scroll animation duration in seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,    // slightly slower than default = more control
      touchMultiplier: 1.5,    // mobile feel
    });

    // Hook Lenis into GSAP ticker so ScrollTrigger stays in sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Store on window so other components can access if needed
    window.lenis = lenis;

    // SMART SCROLL SNAP
    const sectionIds = ['hero', 'menu', 'dishes', 'about', 'reviews', 'contact'];

    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let snapTimeout = null;
    let isSnapping = false;

    const getSnapTarget = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closest = null;
      let closestDistance = Infinity;

      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const sectionCenter = window.scrollY + rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - sectionCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = el;
        }
      });

      return closest;
    };

    const handleScroll = () => {
      if (isSnapping) return;

      const now = Date.now();
      const currentScrollY = window.scrollY;
      const timeDelta = now - lastScrollTime;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      const speed = timeDelta > 0 ? scrollDelta / timeDelta : 0;

      lastScrollY = currentScrollY;
      lastScrollTime = now;

      clearTimeout(snapTimeout);

      if (speed < 0.8) {
        snapTimeout = setTimeout(() => {
          const target = getSnapTarget();
          if (!target) return;

          const distanceFromTop = target.getBoundingClientRect().top;
          const snapZone = window.innerHeight * 0.40;

          if (Math.abs(distanceFromTop) < snapZone) {
            isSnapping = true;
            lenis.scrollTo(target, {
              offset: 0,
              duration: 1.0,
              easing: (t) => 1 - Math.pow(1 - t, 4),
              onComplete: () => {
                isSnapping = false;
              }
            });
          }
        }, 150);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let ctx = gsap.context(() => {
      // LEFT RAIL GSAP
      gsap.to('.left-rail', {
        y: '-=60',
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2
        }
      });

      gsap.fromTo('.left-rail', 
        { opacity: 0 }, 
        { opacity: 0.45, duration: 1.5, delay: 1.5, ease: 'power2.out' }
      );

      // RIGHT RAIL GSAP
      const dot = document.getElementById('scrollDot');
      const labels = document.querySelectorAll('.right-rail-labels span');

      gsap.to(dot, {
        top: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5
        }
      });

      // RIGHT RAIL LABELS - IntersectionObserver for accurate activation
      const sectionMap = [
        { label: 0, id: 'hero' },
        { label: 1, id: 'menu' },
        { label: 2, id: 'dishes' },
        { label: 3, id: 'about' },
        { label: 4, id: 'reviews' },
        { label: 5, id: 'contact' },
      ];

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const activeId = entry.target.id;
              const match = sectionMap.find(s => s.id === activeId);
              if (match !== undefined) {
                labels.forEach((label, i) => {
                  label.classList.toggle('active', i === match.label);
                });
              }
            }
          });
        },
        { 
          threshold: 0.3,
          rootMargin: '-10% 0px -10% 0px' 
        }
      );

      sectionMap.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      gsap.fromTo('.right-rail',
        { opacity: 0 },
        { opacity: 1, duration: 1.5, delay: 1.5, ease: 'power2.out' }
      );
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      window.lenis = null;
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(snapTimeout);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-void text-ivory overflow-x-hidden selection:bg-torii/30">
      <div className="noise-overlay"></div>
      <SakuraCanvas />
      
      {/* LEFT RAIL */}
      <div className="left-rail" aria-hidden="true">
        ようこそ　火　儀式　美食　体験
      </div>

      {/* RIGHT RAIL */}
      <div className="right-rail" aria-hidden="true">
        <div className="right-rail-line">
          <div className="right-rail-dot" id="scrollDot"></div>
        </div>
        <div className="right-rail-labels">
          <span style={{ top: '0%' }} className="active">HERO</span>
          <span style={{ top: '20%' }}>MENU</span>
          <span style={{ top: '40%' }}>DISHES</span>
          <span style={{ top: '60%' }}>ABOUT</span>
          <span style={{ top: '80%' }}>REVIEWS</span>
          <span style={{ top: '100%' }}>CONTACT</span>
        </div>
      </div>

      <Navbar />
      <main>
        <Hero />
        <Menu />
        <Gallery />
        <About />
        <GuestExperience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
