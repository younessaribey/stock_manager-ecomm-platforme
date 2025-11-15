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
var RabbitMQService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let RabbitMQService = RabbitMQService_1 = class RabbitMQService {
    constructor(client) {
        this.client = client;
        this.logger = new common_1.Logger(RabbitMQService_1.name);
    }
    async sendMessage(pattern, data) {
        try {
            return await (0, rxjs_1.firstValueFrom)(this.client.send(pattern, data));
        }
        catch (error) {
            this.logger.error(`RabbitMQ send error for pattern ${pattern}:`, error);
            throw error;
        }
    }
    async emitEvent(pattern, data) {
        try {
            this.client.emit(pattern, data);
        }
        catch (error) {
            this.logger.error(`RabbitMQ emit error for pattern ${pattern}:`, error);
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
exports.RabbitMQService = RabbitMQService = RabbitMQService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RABBITMQ_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map