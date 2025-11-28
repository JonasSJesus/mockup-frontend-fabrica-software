/**
 * Tela de Configurações (Admin)
 * RF18: Horário de Funcionamento
 * 
 * Refatorado seguindo boas práticas:
 * - Lógica de negócio isolada em hooks customizados
 * - Componente focado apenas na UI
 * - Helpers para formatação e validação
 */

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Settings as SettingsIcon,
  Clock,
  Bell,
  FileText,
  Save,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useSettings,
  isValidTimeRange,
  getTimezones,
  getTimezoneLabel,
} from '@/hooks/useSettings';
import { toast } from 'sonner';

export default function Settings() {
  const { settings, isLoading, updateSettings, updateBusinessHours, toggleOutsideHours } =
    useSettings();

  const [formData, setFormData] = useState({
    startTime: '08:00',
    endTime: '18:00',
    timezone: 'America/Sao_Paulo',
    allowOutsideHours: false,
    enableReminders: true,
    reminderFrequency: 7,
    minResponsesForReport: 10,
    autoGenerateReports: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        startTime: settings.businessHours.start,
        endTime: settings.businessHours.end,
        timezone: settings.businessHours.timezone,
        allowOutsideHours: settings.allowOutsideHours,
        enableReminders: settings.enableReminders,
        reminderFrequency: settings.reminderFrequency,
        minResponsesForReport: settings.minResponsesForReport,
        autoGenerateReports: settings.autoGenerateReports,
      });
    }
  }, [settings]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Validar horários
    if (!isValidTimeRange(formData.startTime, formData.endTime)) {
      toast.error('Horário de término deve ser posterior ao horário de início');
      return;
    }

    // Atualizar horário de funcionamento
    await updateBusinessHours({
      start: formData.startTime,
      end: formData.endTime,
      timezone: formData.timezone,
    });

    // Atualizar demais configurações
    await updateSettings({
      allowOutsideHours: formData.allowOutsideHours,
      enableReminders: formData.enableReminders,
      reminderFrequency: formData.reminderFrequency,
      minResponsesForReport: formData.minResponsesForReport,
      autoGenerateReports: formData.autoGenerateReports,
    });

    setHasChanges(false);
  };

  const handleToggleOutsideHours = async (checked: boolean) => {
    await toggleOutsideHours(checked);
    setFormData({ ...formData, allowOutsideHours: checked });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Configurações
            </h1>
            <p className="text-muted-foreground mt-1">
              Configurações do sistema (RF18)
            </p>
          </div>
          {hasChanges && (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          )}
        </div>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <CardTitle>Horário de Funcionamento</CardTitle>
            </div>
            <CardDescription>
              Configure horário comercial para permitir ou restringir preenchimento de
              questionários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Horário de Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Horário de Término</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => handleChange('timezone', value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getTimezones().map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {getTimezoneLabel(tz)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="allowOutsideHours">
                  Permitir fora do horário comercial
                </Label>
                <p className="text-sm text-muted-foreground">
                  Quando desativado, questionários só podem ser preenchidos no horário configurado
                </p>
              </div>
              <Switch
                id="allowOutsideHours"
                checked={formData.allowOutsideHours}
                onCheckedChange={handleToggleOutsideHours}
              />
            </div>

            {!formData.allowOutsideHours && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Preenchimento restrito ao horário comercial: {formData.startTime} às{' '}
                  {formData.endTime}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notificações e Lembretes</CardTitle>
            </div>
            <CardDescription>
              Configure o envio automático de lembretes para funcionários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enableReminders">Habilitar lembretes automáticos</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar notificações para funcionários com questionários pendentes
                </p>
              </div>
              <Switch
                id="enableReminders"
                checked={formData.enableReminders}
                onCheckedChange={(checked) => handleChange('enableReminders', checked)}
              />
            </div>

            {formData.enableReminders && (
              <>
                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="reminderFrequency">
                    Frequência de lembretes (em dias)
                  </Label>
                  <Input
                    id="reminderFrequency"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.reminderFrequency}
                    onChange={(e) =>
                      handleChange('reminderFrequency', parseInt(e.target.value))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Lembretes serão enviados a cada {formData.reminderFrequency} dia(s)
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Relatórios</CardTitle>
            </div>
            <CardDescription>
              Configure a geração automática de relatórios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="autoGenerateReports">Geração automática de relatórios</Label>
                <p className="text-sm text-muted-foreground">
                  Gerar relatórios automaticamente ao final de cada ciclo de questionário
                </p>
              </div>
              <Switch
                id="autoGenerateReports"
                checked={formData.autoGenerateReports}
                onCheckedChange={(checked) => handleChange('autoGenerateReports', checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="minResponsesForReport">
                Mínimo de respostas para gerar relatório
              </Label>
              <Input
                id="minResponsesForReport"
                type="number"
                min="1"
                max="100"
                value={formData.minResponsesForReport}
                onChange={(e) =>
                  handleChange('minResponsesForReport', parseInt(e.target.value))
                }
              />
              <p className="text-sm text-muted-foreground">
                Relatórios só serão gerados após atingir pelo menos{' '}
                {formData.minResponsesForReport} resposta(s)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button (Bottom) */}
        {hasChanges && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Você tem alterações não salvas
                </p>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Todas as Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
