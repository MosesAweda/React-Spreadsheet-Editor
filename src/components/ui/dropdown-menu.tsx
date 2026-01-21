import * as React from "react";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  align?: "start" | "center" | "end";
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {React.Children.map(children, child => 
          React.isValidElement(child) && child.type === DropdownMenuTrigger ? child : null
        )}
      </div>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          {React.Children.map(children, child => 
            React.isValidElement(child) && child.type === DropdownMenuContent 
              ? React.cloneElement(child as React.ReactElement<any>, { onClose: () => setIsOpen(false) })
              : null
          )}
        </>
      )}
    </div>
  );
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

const DropdownMenuContent: React.FC<DropdownMenuContentProps & { onClose?: () => void }> = ({ 
  align = "start", 
  children, 
  className = "",
  onClose 
}) => {
  const alignClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0"
  };
  
  return (
    <div className={`absolute top-full mt-1 ${alignClasses[align]} min-w-[8rem] bg-white border border-gray-200 rounded-md shadow-lg z-50 ${className}`}>
      <div className="py-1" onClick={onClose}>
        {children}
      </div>
    </div>
  );
};

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  children, 
  className = "",
  onClick,
  ...props 
}) => {
  return (
    <div 
      className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};