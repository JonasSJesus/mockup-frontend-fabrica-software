/**
 * Tipos compartilhados do sistema de pesquisa de saúde mental
 * Seguindo princípios SOLID - Single Responsibility
 */

// ============= Enums =============

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SCALE = 'scale',
  TEXT = 'text',
  YES_NO = 'yes_no',
}

export enum SurveyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  READY = 'ready',
  ERROR = 'error',
}

export enum NotificationType {
  SURVEY_PENDING = 'survey_pending',
  DEADLINE_APPROACHING = 'deadline_approaching',
  REPORT_READY = 'report_ready',
  CYCLE_CLOSED = 'cycle_closed',
}

// ============= Entidades Base =============

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ============= Usuário e Autenticação =============

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  sector?: string;
  position?: string;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ============= Empresa =============

export interface Company extends BaseEntity {
  name: string;
  cnpj: string;
  sector: string;
  employeeCount: number;
  isActive: boolean;
  businessHours?: BusinessHours;
}

export interface BusinessHours {
  start: string; // HH:mm format
  end: string; // HH:mm format
  timezone: string;
}

// ============= Funcionário =============

export interface Employee extends BaseEntity {
  name: string;
  email: string;
  companyId: string;
  sector: string;
  position: string;
  isActive: boolean;
}

export interface EmployeeImport {
  name: string;
  email: string;
  sector: string;
  position: string;
}

// ============= Perguntas =============

export interface Question extends BaseEntity {
  text: string;
  type: QuestionType;
  options?: string[]; // Para multiple_choice
  scaleMin?: number; // Para scale
  scaleMax?: number; // Para scale
  scaleLabels?: { min: string; max: string }; // Para scale
  category: string; // ex: "stress", "satisfaction", "burnout"
  isActive: boolean;
}

// ============= Questionário =============

export interface Survey extends BaseEntity {
  title: string;
  description: string;
  companyId: string;
  questions: string[]; // Array de IDs de perguntas
  status: SurveyStatus;
  startDate: string;
  endDate: string;
  reminderFrequency: number; // em dias
  minResponses: number; // Mínimo de respostas para gerar relatório
}

export interface SurveyCycle extends BaseEntity {
  surveyId: string;
  companyId: string;
  startDate: string;
  endDate: string;
  status: SurveyStatus;
  responseCount: number;
  targetCount: number;
}

// ============= Respostas =============

export interface SurveyResponse extends BaseEntity {
  surveyId: string;
  cycleId: string;
  companyId: string;
  sector: string; // Anonimizado - apenas setor, não funcionário
  answers: Answer[];
  submittedAt: string;
}

export interface Answer {
  questionId: string;
  value: string | number;
}

// ============= Relatórios =============

export interface Report extends BaseEntity {
  surveyId: string;
  cycleId: string;
  companyId: string;
  sector?: string; // null = relatório geral
  status: ReportStatus;
  data: ReportData;
  generatedAt?: string;
}

export interface ReportData {
  totalResponses: number;
  responseRate: number;
  sectors: SectorReport[];
  insights: Insight[];
  charts: ChartData[];
}

export interface SectorReport {
  sector: string;
  responseCount: number;
  averageScores: Record<string, number>;
  alerts: Alert[];
}

export interface Insight {
  category: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  affectedSectors: string[];
}

export interface Alert {
  type: 'stress' | 'burnout' | 'dissatisfaction';
  level: 'warning' | 'critical';
  message: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'radar';
  title: string;
  data: any;
  options?: any;
}

// ============= Vídeos e Gamificação =============

export interface Video extends BaseEntity {
  title: string;
  description: string;
  url: string;
  duration: number; // em segundos
  thumbnail: string;
  category: string;
  quizId?: string;
  isActive: boolean;
}

export interface Quiz extends BaseEntity {
  videoId: string;
  questions: QuizQuestion[];
  passingScore: number; // porcentagem
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // índice da resposta correta
}

export interface VideoProgress extends BaseEntity {
  userId: string;
  videoId: string;
  watchedAt: string;
  completed: boolean;
  quizScore?: number;
}

export interface GamificationProgress {
  userId: string;
  totalPoints: number;
  videosWatched: number;
  quizzesCompleted: number;
  surveysCompleted: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// ============= Notificações =============

export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
}

// ============= Pagamentos =============

export interface Payment extends BaseEntity {
  companyId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidAt?: string;
  description: string;
}

// ============= DTOs e Request/Response =============

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============= Dashboard =============

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  activeSurveys: number;
  pendingResponses: number;
  completionRate: number;
  averageWellness: number;
  alerts: Alert[];
  recentReports: Report[];
}

export interface ManagerDashboardStats {
  sectorName: string;
  totalEmployees: number;
  responseRate: number;
  averageWellness: number;
  alerts: Alert[];
  recentReports: Report[];
}

export interface EmployeeDashboardStats {
  pendingSurveys: number;
  completedSurveys: number;
  availableVideos: number;
  gamificationProgress: GamificationProgress;
  notifications: Notification[];
}
