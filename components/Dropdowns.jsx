import Link from 'next/link';
import {useRouter} from 'next/router';

import {Dropdown as BSDropdown} from 'react-bootstrap';


export const Dropdown = ({variant, text, onSelect, children}) => (
  <div className={`main-dropdown ${variant && `main-dropdown--${variant}`}`}>
    <BSDropdown className="main-dropdown__wrap" onSelect={onSelect}>
      <BSDropdown.Toggle as="button" className="btn" type="button">
        <span className="text-el">{text}</span>
        <span className="dropdown-toggle__arrow-start"></span>
        <span className="dropdown-toggle__arrow-end"></span>
        <span className="dropdown-toggle__clip"></span>
      </BSDropdown.Toggle>
      <BSDropdown.Menu as="ul">{children}</BSDropdown.Menu>
    </BSDropdown>
  </div>
);

Dropdown.Item = ({text, active, ...rest}) => (
  <li>
    <BSDropdown.Item className={active && 'dropdown-item--active'} {...rest}>
      {text}
    </BSDropdown.Item>
  </li>
);


export const MenuDropdown = ({text, children}) => (
  <div className="menu-dropdown">
    <BSDropdown className="menu-dropdown__wrap">
      <BSDropdown.Toggle as="button" className="btn" type="button">
        <span className="text-el">{text}</span>
        <span className="dropdown-toggle__clip"></span>
      </BSDropdown.Toggle>
      <BSDropdown.Menu as="ul">{children}</BSDropdown.Menu>
    </BSDropdown>
  </div>
);

const MenuItem = ({text, target}) => {
  const router = useRouter();
  const active = router.pathname === target;
  return (
    <li>
      <BSDropdown.Item
          as={Link}
          href={target}
          className={active ? 'dropdown-item--active' : ''}
      >
        <span className="text-el">{text}</span>
      </BSDropdown.Item>
    </li>
  );
};

MenuDropdown.Item = MenuItem;
