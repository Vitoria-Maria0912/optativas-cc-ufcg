import React from 'react';
import { CaretDownOutlined, DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import "./style.css"

const Select = ({ items, current }) => (
  <Dropdown menu={ {items: items} }>
    <a onClick={e => e.preventDefault()}>
      <Space>
        {current}
        <CaretDownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default Select;