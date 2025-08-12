import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

// Fade In Animation Component
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.4,
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide Up Animation Component
export function SlideUp({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay, 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale In Animation Component
export function ScaleIn({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover Lift Animation Component
export function HoverLift({ 
  children, 
  lift = 5,
  className = "" 
}: { 
  children: ReactNode; 
  lift?: number;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ 
        y: -lift,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Interactive Button Animation
export function AnimatedButton({ 
  children, 
  onClick,
  disabled = false,
  className = "",
  variant = "primary"
}: { 
  children: ReactNode; 
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}) {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-blue-500 text-white",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:border-emerald-500"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${variants[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

// Card Hover Animation
export function AnimatedCard({ 
  children, 
  className = "",
  onClick
}: { 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ 
        y: -2,
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={onClick ? { scale: 0.99 } : {}}
      onClick={onClick}
      className={`
        backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// Number Counter Animation
export function AnimatedCounter({ 
  from = 0, 
  to, 
  duration = 1,
  className = ""
}: { 
  from?: number; 
  to: number; 
  duration?: number;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.span
          animate={{ color: ["#10b981", "#3b82f6", "#10b981"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {to.toLocaleString()}
        </motion.span>
      </motion.span>
    </motion.span>
  );
}

// Loading Dots Animation
export function LoadingDots({ className = "" }: { className?: string }) {
  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      <motion.div
        className="w-2 h-2 bg-emerald-500 rounded-full"
        variants={dotVariants}
        animate="animate"
        style={{ animationDelay: "0s" }}
      />
      <motion.div
        className="w-2 h-2 bg-emerald-500 rounded-full"
        variants={dotVariants}
        animate="animate"
        style={{ animationDelay: "0.2s" }}
      />
      <motion.div
        className="w-2 h-2 bg-emerald-500 rounded-full"
        variants={dotVariants}
        animate="animate"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
}

// Progress Bar Animation
export function AnimatedProgressBar({ 
  progress, 
  className = "",
  showPercentage = true 
}: { 
  progress: number; 
  className?: string;
  showPercentage?: boolean;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {showPercentage && (
          <motion.span
            key={progress}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-medium text-emerald-600"
          >
            {progress}%
          </motion.span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Modal Animation
export function AnimatedModal({ 
  isOpen, 
  onClose, 
  children,
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: ReactNode;
  title?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              {title && (
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
              )}
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Notification Toast Animation
export function AnimatedToast({ 
  message, 
  type = "info", 
  isVisible,
  onClose 
}: { 
  message: string; 
  type?: "success" | "error" | "warning" | "info";
  isVisible: boolean;
  onClose: () => void;
}) {
  const typeStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white", 
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white"
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 100 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50, x: 100 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg
            ${typeStyles[type]}
          `}
        >
          <div className="flex items-center justify-between">
            <span>{message}</span>
            <button 
              onClick={onClose}
              className="ml-4 text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}