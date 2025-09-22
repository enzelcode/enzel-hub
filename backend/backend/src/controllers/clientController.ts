import { Request, Response } from 'express';
import { ClientRepository } from '../repositories/clientRepository';
import { CreateClientRequest, UpdateClientRequest } from '../models/Client';

const clientRepository = new ClientRepository();

export const createClient = async (req: Request, res: Response) => {
  try {
    const clientData: CreateClientRequest = req.body;

    // Validate required fields
    if (!clientData.name || !clientData.email) {
      return res.status(400).json({
        success: false,
        error: 'Nome e email são obrigatórios'
      });
    }

    // Check if client with email already exists
    const existingClient = await clientRepository.findByEmail(clientData.email);
    if (existingClient) {
      return res.status(400).json({
        success: false,
        error: 'Já existe um cliente com este email'
      });
    }

    const client = await clientRepository.create(clientData);

    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await clientRepository.findAll();

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
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const client = await clientRepository.findById(id);

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
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateClientRequest = req.body;

    // If email is being updated, check if it's already in use by another client
    if (updateData.email) {
      const existingClient = await clientRepository.findByEmail(updateData.email);
      if (existingClient && existingClient.id !== id) {
        return res.status(400).json({
          success: false,
          error: 'Já existe um cliente com este email'
        });
      }
    }

    const client = await clientRepository.update(id, updateData);

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
    console.error('Error updating client:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const success = await clientRepository.delete(id);

    if (!success) {
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
};