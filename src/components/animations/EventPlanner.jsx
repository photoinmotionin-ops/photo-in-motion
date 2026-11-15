import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Music, Sparkles, CheckCircle2, ArrowUpRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const items = [
  { id: 'venue', icon: MapPin, title: 'The Venue', color: 'rgba(255, 255, 255, 0.05)', initialX: -220, initialY: -80, finalX: -60, finalY: -50 },
  { id: 'decor', icon: Sparkles, title: 'The Decor', color: 'rgba(198, 164, 107, 0.1)', initialX: 220, initialY: -120, finalX: 60, finalY: -50 },
  { id: 'music', icon: Music, title: 'The Music', color: 'rgba(255, 255, 255, 0.05)', initialX: -200, initialY: 120, finalX: -60, finalY: 50 },
  { id: 'love', icon: Heart, title: 'The Promise', color: 'rgba(198, 164, 107, 0.1)', initialX: 200, initialY: 100, finalX: 60, finalY: 50 },
];

export default function EventPlanner() {
  const [droppedItems, setDroppedItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDragEnd = (event, info, id) => {
    const distanceMoved = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    
    if (distanceMoved > 50 && !droppedItems.includes(id)) {
      const newDropped = [...droppedItems, id];
      setDroppedItems(newDropped);
      
      // If all 4 items are dropped, trigger the success modal after a short delay
      if (newDropped.length === 4) {
        setTimeout(() => setShowSuccess(true), 1000);
      }
    }
  };

  return (
    <>
      <section style={{ height: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        
        <div style={{ textAlign: 'center', position: 'absolute', top: '10%', width: '100%' }}>
          <p className="eyebrow">THE ART OF PLANNING</p>
          <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(40px, 5vw, 60px)', color: 'var(--white)', margin: 0 }}>
            Build Your <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Perfect Day</span>
          </h2>
          <motion.p 
            key={droppedItems.length}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: droppedItems.length === 4 ? 'var(--gold)' : 'var(--muted)', fontSize: '14px', marginTop: '15px', fontWeight: droppedItems.length === 4 ? 700 : 400 }}
          >
            {droppedItems.length === 4 ? 'Event perfectly planned!' : 'Drag the elements into the circle to organize.'}
          </motion.p>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Central Drop Zone */}
          <motion.div 
            animate={{ 
              scale: droppedItems.length === 4 ? [1, 1.05, 1] : 1, 
              borderColor: droppedItems.length === 4 ? 'var(--gold)' : 'rgba(198, 164, 107, 0.2)',
              boxShadow: droppedItems.length === 4 ? '0 0 50px rgba(198, 164, 107, 0.2)' : 'none'
            }}
            transition={{ duration: 1, repeat: droppedItems.length === 4 ? Infinity : 0 }}
            style={{ width: '280px', height: '280px', borderRadius: '50%', border: '2px dashed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'rgba(198, 164, 107, 0.02)' }} 
          >
             {droppedItems.length === 4 ? (
               <CheckCircle2 size={40} color="var(--gold)" />
             ) : (
               <span style={{ fontSize: '50px', fontFamily: 'var(--heading-font)', color: 'var(--gold)', opacity: 0.3 }}>&</span>
             )}
          </motion.div>

          {/* Draggable Cards */}
          {items.map((item) => {
            const Icon = item.icon;
            const isDropped = droppedItems.includes(item.id);

            return (
              <motion.div
                key={item.id}
                drag={!isDropped}
                dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => handleDragEnd(e, info, item.id)}
                whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 100 }}
                initial={{ x: item.initialX, y: item.initialY, opacity: 0 }}
                animate={{ 
                  x: isDropped ? item.finalX : item.initialX, 
                  y: isDropped ? item.finalY : item.initialY, 
                  opacity: 1,
                  scale: isDropped ? 0.9 : 1,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                style={{ 
                  position: 'absolute', padding: '12px 20px', 
                  background: isDropped ? 'var(--gold)' : '#1a1a1a', 
                  borderRadius: '50px', border: isDropped ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)', 
                  display: 'flex', alignItems: 'center', gap: '10px', 
                  cursor: isDropped ? 'default' : 'grab',
                  boxShadow: isDropped ? '0 5px 15px rgba(198, 164, 107, 0.3)' : '0 10px 30px rgba(0,0,0,0.5)',
                  zIndex: isDropped ? 5 : 10
                }}
              >
                <div style={{ background: isDropped ? 'rgba(0,0,0,0.1)' : item.color, padding: '6px', borderRadius: '50%' }}>
                  <Icon size={16} color={isDropped ? '#111' : 'var(--gold)'} />
                </div>
                <span style={{ color: isDropped ? '#111' : 'var(--white)', fontSize: '13px', fontWeight: 600, letterSpacing: '1px' }}>{item.title}</span>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{ background: '#171717', padding: '60px 40px', borderRadius: '24px', border: '1px solid rgba(198, 164, 107, 0.3)', textAlign: 'center', maxWidth: '600px', width: '100%', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}
            >
              <button onClick={() => setShowSuccess(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>

              <Sparkles size={50} color="var(--gold)" style={{ margin: '0 auto 20px' }} />
              
              <h2 style={{ fontFamily: 'var(--heading-font)', fontSize: 'clamp(36px, 5vw, 50px)', color: 'var(--white)', margin: '0 0 20px', lineHeight: 1.1 }}>
                This is the <br/> <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Perfect Event Plan</span>
              </h2>
              
              <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.8', marginBottom: '40px' }}>
                You have curated the perfect elements for an unforgettable day. Now, let's capture it beautifully. Our team is ready to turn your vision into timeless memories.
              </p>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/contact" className="primary-btn" onClick={() => setShowSuccess(false)}>
                  Book Your Date <ArrowUpRight size={18} />
                </Link>
                <button onClick={() => setShowSuccess(false)} className="secondary-btn" style={{ background: 'transparent', borderBottom: '1px solid var(--gold)' }}>
                  Keep Exploring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}