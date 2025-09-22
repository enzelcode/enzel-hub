import { Request, Response } from 'express';
import { ClientRepository } from '@/repositories/clientRepository';
import { CreateClientRequest, UpdateClientRequest } from '@/models/Client';

export class ClientController {
  constructor(private clientRepository: ClientRepository) {}

  // GET /api/clients
  async getAllClients(req: Request, res: Response) {
    try {
      const clients = await this.clientRepository.findAll();
      res.json({
        success: true,
        data: clients
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // GET /api/clients/:id
  async getClientById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await this.clientRepository.findById(id);

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // POST /api/clients
  async createClient(req: Request, res: Response) {
    try {
      const clientData: CreateClientRequest = req.body;

      // Validação básica
      if (!clientData.name || !clientData.email) {
        return res.status(400).json({
          success: false,
          error: 'Nome e email são obrigatórios'
        });
      }

      // Verificar se email já existe
      const existingClient = await this.clientRepository.findByEmail(clientData.email);
      if (existingClient) {
        return res.status(409).json({
          success: false,
          error: 'Email já está em uso'
        });
      }

      const client = await this.clientRepository.create(clientData);

      res.status(201).json({
        success: true,
        data: client,
        message: 'Cliente criado com sucesso'
      });
    } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // PUT /api/clients/:id
  async updateClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateClientRequest = req.body;

      // Se email está sendo atualizado, verificar se já existe
      if (updateData.email) {
        const existingClient = await this.clientRepository.findByEmail(updateData.email);
        if (existingClient && existingClient.id !== id) {
          return res.status(409).json({
            success: false,
            error: 'Email já está em uso'
          });
        }
      }

      const updatedClient = await this.clientRepository.update(id, updateData);

      if (!updatedClient) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      res.json({
        success: true,
        data: updatedClient,
        message: 'Cliente atualizado com sucesso'
      });
    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // DELETE /api/clients/:id
  async deleteClient(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await this.clientRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Cliente deletado com sucesso'
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}