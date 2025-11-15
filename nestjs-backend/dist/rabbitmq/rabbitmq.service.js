"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let RabbitMQService = class RabbitMQService {
    constructor(client) {
        this.client = client;
    }
    async sendMessage(pattern, data) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.client.send(pattern, data));
        }
        catch (error) {
            console.error('RabbitMQ error:', error);
            throw error;
        }
    }
    async emitEvent(pattern, data) {
        try {
            this.client.emit(pattern, data);
        }
        catch (error) {
            console.error('RabbitMQ emit error:', error);
            throw error;
        }
    }
    async sendOrderNotification(orderData) {
        await this.emitEvent('order.created', orderData);
    }
    async sendProductUpdate(productData) {
        await this.emitEvent('product.updated', productData);
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RABBITMQ_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map