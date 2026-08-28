"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
// Criar a aplicação Express
const app = (0, express_1.default)();
// Criar a rota GET principal
// Iniciar o servidor na porta 8000
app.listen(8000, () => {
    console.log("Servidor Iniciado na porta 8000: http://localhost:8000");
});
