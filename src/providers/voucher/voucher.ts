import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkProvider } from '../network/network';
import { OrderProvider } from '../order/order';

@Injectable()
export class VoucherProvider {

  voucher

  constructor(
    private network: NetworkProvider,
    private order: OrderProvider
  ) { }

  async getVoucher(voucher: string) {
    try {
      const v = await this.network.get(this.network.c.VOUCHER + voucher);
      this.order.setVoucher(v);
      return v;
    } catch (error) {
      throw error;
    }
  }
}
