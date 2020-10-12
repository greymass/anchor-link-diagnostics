import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';

import eosLogo from './assets/eos.png';
import fioLogo from './assets/fio.svg';
import jungleLogo from './assets/jungle.png';
import protonLogo from './assets/proton.png';
import telosLogo from './assets/telos.png';
import waxLogo from './assets/wax.png';

import blockchains from './assets/blockchains.json';

const logoMap = {
  "21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c": fioLogo,
  "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906": eosLogo,
  "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f": eosLogo,
  "b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e": fioLogo,
  "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473": jungleLogo,
  "2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840": jungleLogo,
  "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0": protonLogo,
  "71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd": protonLogo,
  "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11": telosLogo,
  "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f": telosLogo,
  "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4": waxLogo,
  "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12": waxLogo,
};

const options = blockchains.map((chain) => {
  return {
    key: chain.chainId,
    text: chain.name,
    value: chain.chainId,
    image: {
      avatar: true,
      src: logoMap[chain.chainId]
    },
  }
});


class Blockchains extends Component {
  render() {
    const { chain } = this.props;
    return (
      <Dropdown
        fluid
        onChange={this.props.onChange}
        options={options}
        placeholder='Select Blockchain...'
        search
        selection
        value={chain.chainId}
      />
    );
  }
}

export default Blockchains;
