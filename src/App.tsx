import React, { useState, useEffect } from 'react';
import { ScreenType, GeoRequest, UserProfile, WalletTransaction, AppNotification, AdminRecharge, UserSettings, RequestResponse } from './types';
import { INITIAL_REQUESTS, INITIAL_USER, INITIAL_TRANSACTIONS, INITIAL_NOTIFICATIONS, INITIAL_ADMIN_RECHARGES, INITIAL_SETTINGS } from './data/mockData';
import { AppHeader } from './components/common/AppHeader';
import { BottomNavBar } from './components/common/BottomNavBar';
import { AppNavigatorToolbar } from './components/common/AppNavigatorToolbar';
import { SpeechReaderModal } from './components/common/SpeechReaderModal';

// Screens
import { LoginScreen } from './components/screens/LoginScreen';
import { OtpScreen } from './components/screens/OtpScreen';
import { MapScreen } from './components/screens/MapScreen';
import { CreateRequestScreen } from './components/screens/CreateRequestScreen';
import { RequestDetailScreen } from './components/screens/RequestDetailScreen';
import { RespondRequestScreen } from './components/screens/RespondRequestScreen';
import { WalletScreen } from './components/screens/WalletScreen';
import { RechargeScreen } from './components/screens/RechargeScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { RatingScreen } from './components/screens/RatingScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { DesignSystemScreen } from './components/screens/DesignSystemScreen';

export default function App() {
  // Navigation & State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('map');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('map');
  const [loginPhone, setLoginPhone] = useState<string>('+56 9 8765 4321');
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);
  const [showSpeechReader, setShowSpeechReader] = useState<boolean>(false);

  // Core Data
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [requests, setRequests] = useState<GeoRequest[]>(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<GeoRequest>(INITIAL_REQUESTS[0]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [adminRecharges, setAdminRecharges] = useState<AdminRecharge[]>(INITIAL_ADMIN_RECHARGES);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_SETTINGS);

  // Navigation Handler
  const navigateTo = (screen: ScreenType) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Unread notifications count
  const unreadNotifsCount = notifications.filter((n) => n.unread).length;

  // Handlers for App Actions
  const handleLoginSuccess = (phone: string) => {
    setLoginPhone(phone);
    navigateTo('otp');
  };

  const handleOtpVerified = () => {
    setUser((prev) => ({ ...prev, phone: loginPhone }));
    navigateTo('map');
  };

  const handleCreateRequestSuccess = (newReq: GeoRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    // Deduct cost from user wallet
    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - newReq.totalCost),
      requestedTasks: prev.requestedTasks + 1
    }));
    // Add transaction
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'request_payment',
      amount: -newReq.totalCost,
      title: 'Publicación de solicitud',
      description: `Consulta en ${newReq.location.name} ($${newReq.reward} + $${newReq.commission} comisión)`,
      timestamp: 'Hoy, ahora',
      status: 'completed',
      relatedRequestId: newReq.id
    };
    setTransactions((prev) => [newTx, ...prev]);
    setSelectedRequest(newReq);
    navigateTo('map');
  };

  const handleResponseSent = (newResp: RequestResponse, rewardAmount: number) => {
    // Add response to the request
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === newResp.requestId) {
          return {
            ...req,
            status: 'answered',
            responses: [newResp, ...req.responses]
          };
        }
        return req;
      })
    );

    // Credit reward to user balance
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + rewardAmount,
      completedTasks: prev.completedTasks + 1
    }));

    // Add reward transaction
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'reward_earned',
      amount: rewardAmount,
      title: 'Recompensa acreditada',
      description: `Respuesta enviada para ${selectedRequest.location.name}`,
      timestamp: 'Hoy, ahora',
      status: 'completed',
      relatedRequestId: newResp.requestId
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: '¡Pago recibido! 💰',
      body: `Se abonaron $${rewardAmount.toLocaleString('es-CL')} a tu saldo por tu respuesta en ${selectedRequest.location.name}.`,
      timestamp: 'Ahora',
      dateGroup: 'Hoy',
      unread: true,
      type: 'payment_received',
      targetScreen: 'wallet'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    navigateTo('rating');
  };

  const handleRatingSubmitted = (stars: number, comment: string) => {
    navigateTo('map');
  };

  const handleRechargeSubmitted = (newRecharge: AdminRecharge) => {
    setAdminRecharges((prev) => [newRecharge, ...prev]);
    navigateTo('wallet');
  };

  const handleApproveRecharge = (rechargeId: string) => {
    const recharge = adminRecharges.find((r) => r.id === rechargeId);
    if (!recharge) return;

    setAdminRecharges((prev) =>
      prev.map((r) => (r.id === rechargeId ? { ...r, status: 'approved' } : r))
    );

    // Credit user's wallet
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + recharge.amount
    }));

    // Add transaction
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'recharge',
      amount: recharge.amount,
      title: 'Recarga aprobada por Administrador',
      description: `Transferencia ${recharge.bankName} (${recharge.operationNumber})`,
      timestamp: 'Hoy, ahora',
      status: 'completed',
      referenceNumber: recharge.operationNumber
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Recarga aprobada ✅',
      body: `Tu transferencia de $${recharge.amount.toLocaleString('es-CL')} ha sido acreditada con éxito.`,
      timestamp: 'Ahora',
      dateGroup: 'Hoy',
      unread: true,
      type: 'recharge_approved',
      targetScreen: 'wallet'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleRejectRecharge = (rechargeId: string) => {
    setAdminRecharges((prev) =>
      prev.map((r) => (r.id === rechargeId ? { ...r, status: 'rejected' } : r))
    );
  };

  const handleMarkAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleResetDemoData = () => {
    setUser(INITIAL_USER);
    setRequests(INITIAL_REQUESTS);
    setSelectedRequest(INITIAL_REQUESTS[0]);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAdminRecharges(INITIAL_ADMIN_RECHARGES);
    setSettings(INITIAL_SETTINGS);
    setCurrentScreen('map');
  };

  // Screen Text Summary for Speech Reader
  const getScreenSpeechSummary = (): { title: string; text: string } => {
    switch (currentScreen) {
      case 'login':
        return {
          title: 'Acceso MtiGo',
          text: 'MtiGo. Información en tiempo real, de personas que están físicamente ahí mediante micropagos. Ingresa tu número de teléfono para recibir un código de acceso por SMS.'
        };
      case 'otp':
        return {
          title: 'Verificación de Código',
          text: 'Ingresa el código SMS de seis dígitos enviado a tu teléfono para validar tu identidad de forma segura.'
        };
      case 'map':
        return {
          title: 'Mapa de Villarrica',
          text: `Mapa interactivo de Villarrica. Hay ${requests.length} solicitudes activas con recompensas de 500 a 2000 pesos en Playa Grande, Costanera y Feria Artesanal.`
        };
      case 'create_request':
        return {
          title: 'Crear Solicitud',
          text: 'Formulario de consulta geolocalizada. Puedes pedir foto en vivo, nota de voz, texto o emoji, fijando el monto a pagar y el tiempo límite.'
        };
      case 'request_detail':
        return {
          title: 'Detalle de Solicitud',
          text: `Pregunta: ${selectedRequest.question}. Ubicación: ${selectedRequest.location.name}. Recompensa: ${selectedRequest.reward} pesos.`
        };
      case 'respond_request':
        return {
          title: 'Responder Solicitud',
          text: `Envía tu respuesta para ganar ${selectedRequest.reward} pesos de forma instantánea.`
        };
      case 'wallet':
        return {
          title: 'Billetera Digital',
          text: `Tu saldo disponible es de ${user.balance} pesos chilenos. Puedes recargar mediante transferencia bancaria rápida.`
        };
      case 'recharge':
        return {
          title: 'Recarga de Saldo',
          text: 'Realiza una transferencia a la cuenta de MtiGo SpA en Banco Santander y reporta tu comprobante para activación en minutos.'
        };
      case 'profile':
        return {
          title: 'Perfil de Usuario',
          text: `Usuario ${user.name}, calificación 4.9 estrellas con 34 tareas completadas con éxito.`
        };
      case 'rating':
        return {
          title: 'Calificación',
          text: 'Califica la calidad y rapidez de la respuesta recibida para fortalecer la confianza comunitaria.'
        };
      case 'notifications':
        return {
          title: 'Notificaciones',
          text: `Tienes ${unreadNotifsCount} notificaciones nuevas sobre solicitudes cercanas y pagos acreditados.`
        };
      case 'admin':
        return {
          title: 'Panel de Administración',
          text: 'Métricas de la plataforma y mesa de validación de recargas bancarias en tiempo real.'
        };
      case 'settings':
        return {
          title: 'Configuración y Accesibilidad',
          text: 'Ajustes de tamaño de texto aumentado, modo de alto contraste para baja visión y asistente de lectura audible.'
        };
      default:
        return {
          title: 'MtiGo Villarrica',
          text: 'App móvil de solicitudes geolocalizadas con micropagos en tiempo real.'
        };
    }
  };

  const speechData = getScreenSpeechSummary();

  // Root class calculation for Accessibility settings
  const rootAccessibilityClass = `${settings.largeText ? 'accessibility-large-text' : ''} ${settings.highContrast ? 'accessibility-high-contrast' : ''}`;

  return (
    <div className={`min-h-screen bg-[#E2ECE4] flex flex-col ${rootAccessibilityClass}`}>
      {/* Top Floating App Navigator Toolbar */}
      <AppNavigatorToolbar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => navigateTo(screen)}
        isDeviceFrame={isDeviceFrame}
        onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        onResetDemoData={handleResetDemoData}
        onTriggerSpeechReader={() => setShowSpeechReader(true)}
      />

      {/* Main Container: Mobile Frame or Full Screen */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-x-hidden">
        <div
          className={`
            w-full transition-all duration-300 bg-[#F4FAF5]
            ${isDeviceFrame && currentScreen !== 'admin' && currentScreen !== 'design_system'
              ? 'max-w-[430px] min-h-[780px] h-[92vh] max-h-[890px] rounded-none sm:rounded-[44px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] border-0 sm:border-[10px] border-[#1B3A1F] flex flex-col overflow-hidden relative'
              : 'max-w-6xl min-h-screen shadow-sm'
            }
          `}
        >
          {/* Mobile Phone Notch & Status Bar (in Device Frame mode) */}
          {isDeviceFrame && currentScreen !== 'admin' && currentScreen !== 'design_system' && (
            <div className="bg-white border-b border-[#E0E8E1] px-6 py-2 flex items-center justify-between text-[11px] font-bold text-[#1B3A1F] select-none sticky top-0 z-40">
              <span>9:41</span>
              {/* Dynamic Island / Notch */}
              <div className="w-24 h-4 bg-[#1B3A1F] rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Standard App Header (for in-app screens) */}
          {currentScreen !== 'login' &&
            currentScreen !== 'otp' &&
            currentScreen !== 'admin' &&
            currentScreen !== 'design_system' && (
              <AppHeader
                user={user}
                currentScreen={currentScreen}
                unreadCount={unreadNotifsCount}
                showBack={
                  currentScreen === 'create_request' ||
                  currentScreen === 'request_detail' ||
                  currentScreen === 'respond_request' ||
                  currentScreen === 'recharge' ||
                  currentScreen === 'rating' ||
                  currentScreen === 'notifications' ||
                  currentScreen === 'settings'
                }
                onBack={() => navigateTo(previousScreen || 'map')}
                onNavigate={(s) => navigateTo(s)}
                onReadScreenText={() => setShowSpeechReader(true)}
              />
            )}

          {/* ─────────────────────────────────────────────────────────────
              SCREEN SWITCHER (13 SCREENS)
          ─────────────────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto relative">
            {/* Pantalla 1: Login */}
            {currentScreen === 'login' && (
              <LoginScreen
                onLoginSuccess={handleLoginSuccess}
                onGoToAdminDemo={() => navigateTo('admin')}
              />
            )}

            {/* Pantalla 2: Verificación OTP */}
            {currentScreen === 'otp' && (
              <OtpScreen
                phoneNumber={loginPhone}
                onVerifySuccess={handleOtpVerified}
                onBack={() => navigateTo('login')}
              />
            )}

            {/* Pantalla 3: Mapa Home */}
            {currentScreen === 'map' && (
              <MapScreen
                requests={requests}
                user={user}
                onSelectRequest={(req) => {
                  setSelectedRequest(req);
                  navigateTo('request_detail');
                }}
                onCreateRequest={() => navigateTo('create_request')}
                onNavigateToWallet={() => navigateTo('wallet')}
                onNavigateToProfile={() => navigateTo('profile')}
              />
            )}

            {/* Pantalla 4: Crear Solicitud */}
            {currentScreen === 'create_request' && (
              <CreateRequestScreen
                user={user}
                onCreateSuccess={handleCreateRequestSuccess}
                onCancel={() => navigateTo('map')}
                onRechargeNeeded={() => navigateTo('recharge')}
              />
            )}

            {/* Pantalla 5: Detalle de Solicitud */}
            {currentScreen === 'request_detail' && (
              <RequestDetailScreen
                request={selectedRequest}
                onRespond={(req) => {
                  setSelectedRequest(req);
                  navigateTo('respond_request');
                }}
                onViewOnMap={() => navigateTo('map')}
                onBack={() => navigateTo('map')}
              />
            )}

            {/* Pantalla 6: Responder Solicitud */}
            {currentScreen === 'respond_request' && (
              <RespondRequestScreen
                request={selectedRequest}
                user={user}
                onResponseSent={handleResponseSent}
                onBack={() => navigateTo('request_detail')}
              />
            )}

            {/* Pantalla 7: Wallet */}
            {currentScreen === 'wallet' && (
              <WalletScreen
                user={user}
                transactions={transactions}
                onNavigateToRecharge={() => navigateTo('recharge')}
              />
            )}

            {/* Pantalla 8: Recargar Saldo */}
            {currentScreen === 'recharge' && (
              <RechargeScreen
                onRechargeSubmitted={handleRechargeSubmitted}
                onBack={() => navigateTo('wallet')}
              />
            )}

            {/* Pantalla 9: Perfil */}
            {currentScreen === 'profile' && (
              <ProfileScreen
                user={user}
                unreadNotifsCount={unreadNotifsCount}
                onNavigate={(s) => navigateTo(s)}
                onLogout={() => navigateTo('login')}
              />
            )}

            {/* Pantalla 10: Calificación */}
            {currentScreen === 'rating' && (
              <RatingScreen
                requesterOrAuthorName={selectedRequest?.requesterName || 'Camila Rojas'}
                onRatingSubmitted={handleRatingSubmitted}
                onBack={() => navigateTo('map')}
              />
            )}

            {/* Pantalla 11: Notificaciones */}
            {currentScreen === 'notifications' && (
              <NotificationsScreen
                notifications={notifications}
                onMarkAllAsRead={handleMarkAllNotifsAsRead}
                onSelectNotification={(notif) => {
                  if (notif.targetScreen) navigateTo(notif.targetScreen);
                }}
                onBack={() => navigateTo('profile')}
              />
            )}

            {/* Pantalla 12: Admin Dashboard (Web) */}
            {currentScreen === 'admin' && (
              <AdminDashboardScreen
                recharges={adminRecharges}
                requests={requests}
                onApproveRecharge={handleApproveRecharge}
                onRejectRecharge={handleRejectRecharge}
                onBackToApp={() => navigateTo('map')}
              />
            )}

            {/* Pantalla 13: Settings */}
            {currentScreen === 'settings' && (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
                onBack={() => navigateTo('profile')}
              />
            )}

            {/* Especial: Design System */}
            {currentScreen === 'design_system' && (
              <DesignSystemScreen onBack={() => navigateTo('map')} />
            )}
          </div>

          {/* Bottom Navigation Bar (Shown on root main tabs) */}
          {(currentScreen === 'map' ||
            currentScreen === 'wallet' ||
            currentScreen === 'profile' ||
            currentScreen === 'notifications' ||
            currentScreen === 'settings') && (
            <BottomNavBar
              currentScreen={currentScreen}
              unreadNotifsCount={unreadNotifsCount}
              onNavigate={(s) => navigateTo(s)}
            />
          )}

          {/* Phone Bottom Home Indicator (in Device Frame Mode) */}
          {isDeviceFrame && currentScreen !== 'admin' && currentScreen !== 'design_system' && (
            <div className="bg-white pb-2 pt-1 flex justify-center border-t border-[#E0E8E1]/30">
              <div className="w-32 h-1 bg-[#1B3A1F]/30 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Accessible Speech Voice Reader Modal */}
      {showSpeechReader && (
        <SpeechReaderModal
          currentScreenName={speechData.title}
          screenTextSummary={speechData.text}
          onClose={() => setShowSpeechReader(false)}
        />
      )}
    </div>
  );
}
