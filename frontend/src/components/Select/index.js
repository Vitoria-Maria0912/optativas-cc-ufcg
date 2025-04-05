import React from 'react';
import { CaretDownOutlined, DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import "./style.css"

const Select = ({ items }) => (
  <Dropdown menu={ {items: items} }>
    <a onClick={e => e.preventDefault()}>
      <Space>
        {items.find(item => item.key == "0")["name"]}
        <CaretDownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default Select;