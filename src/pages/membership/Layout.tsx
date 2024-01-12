import React, { ReactElement } from 'react';
import { Navbar, NextUIProvider } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

export declare interface LayoutProps {
  children?: ReactElement;
  name ?: String;
}

const Layout = (props: LayoutProps) => {
  let navigate = useNavigate();

  return (
    <NextUIProvider>
      <Navbar variant={'sticky'}>
        <Navbar.Brand>
          <img alt="acmlogo" src={require('./acmlogo.png')} style={styles.logo} />
        </Navbar.Brand>
        <Navbar.Content enableCursorHighlight hideIn='xs'>
          <Navbar.Link onClick={() => {window.location.replace('/');}}>Home</Navbar.Link>
          <Navbar.Link isActive>{props.name ? props.name : "Membership"}</Navbar.Link>
        </Navbar.Content>
      </Navbar>
      {props.children}
    </NextUIProvider>
  );
};

const styles = {
  logo: {
    maxHeight: '50px',
    padding: '5px 7px 0px 8px',
    borderRadius: '0.75em'
  }
};

export default Layout;
