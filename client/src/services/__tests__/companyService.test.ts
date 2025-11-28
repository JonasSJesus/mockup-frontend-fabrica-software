/**
 * Testes para CompanyService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { companyService } from '../companyService';
import { Company } from '@/../../shared/types';

describe('CompanyService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    // Note: In a real scenario, we would need to reset the service state
  });

  it('deve listar todas as empresas', async () => {
    const response = await companyService.getAll();

    expect(response.data).toBeInstanceOf(Array);
    expect(response.total).toBeGreaterThan(0);
    expect(response.page).toBe(1);
  });

  it('deve buscar empresa por ID', async () => {
    const companies = await companyService.getAll();
    const firstCompany = companies.data[0];

    const company = await companyService.getById(firstCompany.id);

    expect(company).toBeDefined();
    expect(company.id).toBe(firstCompany.id);
    expect(company.name).toBe(firstCompany.name);
  });

  it('deve criar nova empresa', async () => {
    const newCompanyData: Partial<Company> = {
      name: 'Nova Empresa Teste',
      cnpj: '11.222.333/0001-44',
      sector: 'Teste',
      employeeCount: 50,
      businessHours: {
        start: '08:00',
        end: '17:00',
        timezone: 'America/Sao_Paulo',
      },
    };

    const createdCompany = await companyService.create(newCompanyData);

    expect(createdCompany).toBeDefined();
    expect(createdCompany.id).toBeDefined();
    expect(createdCompany.name).toBe(newCompanyData.name);
    expect(createdCompany.cnpj).toBe(newCompanyData.cnpj);
    expect(createdCompany.isActive).toBe(true);
  });

  it('deve atualizar empresa existente', async () => {
    const companies = await companyService.getAll();
    const companyToUpdate = companies.data[0];

    const updatedData: Partial<Company> = {
      name: 'Nome Atualizado',
      employeeCount: 200,
    };

    const updatedCompany = await companyService.update(
      companyToUpdate.id,
      updatedData
    );

    expect(updatedCompany.id).toBe(companyToUpdate.id);
    expect(updatedCompany.name).toBe(updatedData.name);
    expect(updatedCompany.employeeCount).toBe(updatedData.employeeCount);
  });

  it('deve excluir empresa', async () => {
    const newCompany = await companyService.create({
      name: 'Empresa para Excluir',
      cnpj: '99.999.999/0001-99',
      sector: 'Teste',
      employeeCount: 10,
    });

    await companyService.delete(newCompany.id);

    await expect(async () => {
      await companyService.getById(newCompany.id);
    }).rejects.toThrow('Empresa não encontrada');
  });

  it('deve retornar erro ao buscar empresa inexistente', async () => {
    await expect(async () => {
      await companyService.getById('id-inexistente');
    }).rejects.toThrow('Empresa não encontrada');
  });

  it('deve paginar resultados corretamente', async () => {
    const page1 = await companyService.getAll({ page: 1, limit: 1 });
    const page2 = await companyService.getAll({ page: 2, limit: 1 });

    expect(page1.data.length).toBe(1);
    expect(page2.data.length).toBeLessThanOrEqual(1);
    expect(page1.page).toBe(1);
    expect(page2.page).toBe(2);
  });

  it('deve ter horário de funcionamento configurado', async () => {
    const companies = await companyService.getAll();
    const company = companies.data[0];

    expect(company.businessHours).toBeDefined();
    expect(company.businessHours?.start).toMatch(/^\d{2}:\d{2}$/);
    expect(company.businessHours?.end).toMatch(/^\d{2}:\d{2}$/);
    expect(company.businessHours?.timezone).toBe('America/Sao_Paulo');
  });
});
