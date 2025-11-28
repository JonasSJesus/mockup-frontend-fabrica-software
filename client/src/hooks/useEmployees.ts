/**
 * Hook customizado para gerenciar funcionários
 * Seguindo princípios SOLID - Separation of Concerns
 */

import { useState, useEffect } from 'react';
import { employeeService } from '@/services/employeeService';
import { companyService } from '@/services/companyService';
import { Employee, Company, EmployeeImport } from '@/../../shared/types';
import { toast } from 'sonner';
import { parseCsvFile } from '@/lib/csv';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [employeesRes, companiesRes] = await Promise.all([
        employeeService.getAll(),
        companyService.getAll(),
      ]);
      setEmployees(employeesRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const createEmployee = async (data: Partial<Employee>) => {
    try {
      await employeeService.create(data);
      toast.success('Funcionário cadastrado com sucesso! E-mail de boas-vindas enviado.');
      await loadData();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao cadastrar funcionário');
      return false;
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      await employeeService.update(id, data);
      toast.success('Funcionário atualizado com sucesso');
      await loadData();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar funcionário');
      return false;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeeService.delete(id);
      toast.success('Funcionário desativado com sucesso');
      await loadData();
      return true;
    } catch (error) {
      toast.error('Erro ao desativar funcionário');
      return false;
    }
  };

  const importFromCsv = async (file: File, companyId: string) => {
    try {
      const data = await parseCsvFile<EmployeeImport>(file, (row) => ({
        name: row[0],
        email: row[1],
        sector: row[2],
        position: row[3],
      }));

      if (data.length === 0) {
        toast.error('Nenhum dado válido encontrado no arquivo');
        return false;
      }

      const result = await employeeService.importFromCSV(companyId, data);

      if (result.errors.length > 0) {
        toast.warning(
          `Importação concluída com ${result.success} sucesso(s) e ${result.errors.length} erro(s)`,
          {
            description: result.errors
              .slice(0, 3)
              .map((e) => `Linha ${e.row}: ${e.error}`)
              .join('\n'),
          }
        );
      } else {
        toast.success(`${result.success} funcionário(s) importado(s) com sucesso!`);
      }

      await loadData();
      return true;
    } catch (error) {
      toast.error('Erro ao importar arquivo CSV');
      return false;
    }
  };

  return {
    employees,
    companies,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    importFromCsv,
    refresh: loadData,
  };
}
