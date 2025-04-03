import React from 'react';
import { CaretDownOutlined, DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import "./style.css"

const items = [
  {
    key: '1',
    label: (
      <a rel="noopener noreferrer" href="#">
        Planejamento 1
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a rel="noopener noreferrer" href="#">
        Planejamento 2
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a rel="noopener noreferrer" href="#">
        Planejamento 3
      </a>
    ),
  },
];

const Select = () => (
  <Dropdown menu={{ items }}>
    <a onClick={e => e.preventDefault()}>
      <Space>
        Planejamento 1
        <CaretDownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default Select;