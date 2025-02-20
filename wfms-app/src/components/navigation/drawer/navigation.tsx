import React, { FC } from 'react';
import { Button } from 'reactstrap';
import './drawer.css';

interface DrawerProps {
  open: boolean;
  toggleDrawer: () => void;
  title?: string;
  children?: React.ReactNode;
}

const Drawer = ({ open, toggleDrawer, title = "Drawer Content", children }: DrawerProps) => {
  return (
    <div className={`drawer ${open ? 'open' : ''}`}>
      <div className="drawer-header">
        <h4>{title}</h4>
        <Button color="secondary" size="sm" onClick={toggleDrawer}>
          Close
        </Button>
      </div>
      <div className="drawer-body">
        {children}
      </div>
    </div>
  );
};

export default Drawer;
