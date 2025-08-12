import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20,
    filter: 'blur(4px)'
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  out: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const slideVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95
  }),
  in: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  out: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 1.05,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export const PageTransition = ({ children }: PageTransitionProps) => {
  const [location] = useLocation();
  const [direction, setDirection] = useState(0);
  const [prevLocation, setPrevLocation] = useState(location);

  // Route order for determining slide direction
  const routes = [
    '/',
    '/catalog',
    '/production',
    '/inventory',
    '/distributors',
    '/routes',
    '/purchase-orders',
    '/factory-setup',
    '/automation',
    '/bulk-import',
    '/company-settings',
    '/login',
    '/register',
    '/analytics'
  ];

  useEffect(() => {
    const prevIndex = routes.indexOf(prevLocation);
    const currentIndex = routes.indexOf(location);
    
    if (prevIndex !== -1 && currentIndex !== -1) {
      setDirection(currentIndex > prevIndex ? 1 : -1);
    } else {
      setDirection(0);
    }
    
    setPrevLocation(location);
  }, [location, prevLocation, routes]);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={location}
        custom={direction}
        variants={location === '/' ? pageVariants : slideVariants}
        initial="initial"
        animate="in"
        exit="out"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Loading transition component for async operations
export const LoadingTransition = ({ isLoading, children }: { isLoading: boolean; children: ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 font-medium"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Staggered animation for lists and grids
export const StaggerContainer = ({ children, delay = 0.1 }: { children: ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, index = 0 }: { children: ReactNode; index?: number }) => {
  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y: 20,
          scale: 0.95 
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};