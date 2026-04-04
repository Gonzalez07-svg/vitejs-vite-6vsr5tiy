import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { 
  Users, 
  FileText, 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  ArrowLeft, 
  Save,
  Settings,
  CheckCircle2,
  Globe,
  LogOut,
  Lock
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyAlwuMih2vA0qxEgT7xjmbg-9WiKCHiIoc",
  authDomain: "dioskos-app-oficial.firebaseapp.com", // Agregué -oficial
  projectId: "dioskos-app-oficial",                  // Agregué -oficial
  storageBucket: "dioskos-app-oficial.firebasestorage.app", // Agregué -oficial
  messagingSenderId: "253998926019",
  appId: "1:253998926019:web:1e1394045a112d5adb7a76"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "dioskos-app-oficial";

// --- TRANSLATIONS DICTIONARY ---
const translations = {
  es: {
    appSubtitle: "Gestión de Trabajos",
    dashboard: "Resumen",
    clients: "Clientes",
    quotes: "Proformas",
    invoices: "Recibos",
    settings: "Configuración",
    overview: "Resumen General",
    welcome: "Bienvenido a tu panel de control de trabajos.",
    viewAll: "Ver todos",
    newQuoteBtn: "+ Nueva Proforma",
    newInvoiceBtn: "+ Nuevo Recibo",
    latestDocs: "Últimos Documentos",
    noDocs: "Aún no hay proformas ni recibos creados.",
    date: "Fecha",
    client: "Cliente",
    total: "Total",
    actions: "Acciones",
    noDocsType: "No hay documentos creados todavía.",
    viewPrint: "Ver / Imprimir",
    newBtn: "Nuevo",
    dirClients: "Directorio de Clientes",
    dirDesc: "Mantén el historial de las personas a las que les trabajas.",
    newClient: "Nuevo Cliente",
    addClient: "Agregar Nuevo Cliente",
    fullName: "Nombre Completo *",
    phone: "Teléfono / WhatsApp",
    address: "Dirección (Opcional)",
    cancel: "Cancelar",
    saveClient: "Guardar Cliente",
    noClients: "No tienes clientes registrados.",
    addFirst: "Agrega tu primer cliente",
    unregistered: "No registrado",
    createDoc: "Crear Nueva",
    selectClient: "-- Seleccionar Cliente --",
    clientWarn: "Primero debes registrar un cliente en la sección 'Clientes'.",
    details: "Detalle de Trabajos / Materiales",
    desc: "Descripción del Trabajo",
    qty: "Cantidad",
    unitPrice: "Precio Unit.",
    subtotal: "Subtotal",
    add: "Agregar",
    notesInfo: "Agrega los trabajos o materiales usando el formulario de arriba.",
    notes: "Notas Adicionales (Opcional)",
    notesPlaceholder: "Añade notas extra aquí si las necesitas...",
    saveDoc: "Guardar",
    back: "Volver",
    print: "Imprimir / PDF",
    configTitle: "Configuración de Empresa",
    configDesc: "Estos datos aparecerán en los encabezados de tus facturas y proformas.",
    compName: "Nombre de la Empresa",
    email: "Correo Electrónico",
    logoUrl: "URL del Logo (Link de la imagen)",
    logoHint: "Sube tu logo a un servicio como Imgur o similar y pega el enlace directo aquí.",
    saveChanges: "Guardar Cambios",
    saved: "Guardado",
    printQuoteLabel: "Cotización",
    printInvoiceLabel: "Invoice",
    printIssued: "Emitida el",
    printSubmitted: "Submitted on",
    printQuoteFor: "Cotización para",
    printInvoiceFor: "Invoice for",
    printClientName: "Client name:",
    printJobAddress: "Job address:",
    printDesc: "Descripción",
    printPrice: "Precio",
    printTotal: "Total:",
    printNotesTitle: "Notas:",
    printNotesDefault: "Alcance y precios basados en el trabajo descrito arriba.",
    errClient: "Por favor, selecciona un cliente.",
    errItems: "Debes agregar al menos un trabajo o material a la lista.",
    unids: "unids",
    connecting: "Cargando sistema...",
    loginTitle: "Acceso al Sistema",
    loginDesc: "Ingresa tus credenciales para continuar.",
    emailLabel: "Correo Electrónico",
    passLabel: "Contraseña",
    loginBtn: "Iniciar Sesión",
    loginErr: "Correo o contraseña incorrectos.",
    logout: "Cerrar Sesión"
  },
  en: {
    appSubtitle: "Job Management",
    dashboard: "Dashboard",
    clients: "Clients",
    quotes: "Quotes",
    invoices: "Invoices",
    settings: "Settings",
    overview: "Overview",
    welcome: "Welcome to your job control panel.",
    viewAll: "View all",
    newQuoteBtn: "+ New Quote",
    newInvoiceBtn: "+ New Invoice",
    latestDocs: "Latest Documents",
    noDocs: "No quotes or invoices created yet.",
    date: "Date",
    client: "Client",
    total: "Total",
    actions: "Actions",
    noDocsType: "No documents created yet.",
    viewPrint: "View / Print",
    newBtn: "New",
    dirClients: "Client Directory",
    dirDesc: "Keep track of the people you work for.",
    newClient: "New Client",
    addClient: "Add New Client",
    fullName: "Full Name *",
    phone: "Phone / WhatsApp",
    address: "Address (Optional)",
    cancel: "Cancel",
    saveClient: "Save Client",
    noClients: "You have no registered clients.",
    addFirst: "Add your first client",
    unregistered: "Not registered",
    createDoc: "Create New",
    selectClient: "-- Select Client --",
    clientWarn: "You must first register a client in the 'Clients' section.",
    details: "Work / Materials Details",
    desc: "Job Description",
    qty: "Qty",
    unitPrice: "Unit Price",
    subtotal: "Subtotal",
    add: "Add",
    notesInfo: "Add works or materials using the form above.",
    notes: "Additional Notes (Optional)",
    notesPlaceholder: "Add extra notes here if needed...",
    saveDoc: "Save",
    back: "Back",
    print: "Print / PDF",
    configTitle: "Company Settings",
    configDesc: "This data will appear in the headers of your invoices and quotes.",
    compName: "Company Name",
    email: "Email Address",
    logoUrl: "Logo URL (Image Link)",
    logoHint: "Upload your logo to a service like Imgur and paste the direct link here.",
    saveChanges: "Save Changes",
    saved: "Saved",
    printQuoteLabel: "Quote",
    printInvoiceLabel: "Invoice",
    printIssued: "Issued on",
    printSubmitted: "Submitted on",
    printQuoteFor: "Quote for",
    printInvoiceFor: "Invoice for",
    printClientName: "Client name:",
    printJobAddress: "Job address:",
    printDesc: "Description",
    printPrice: "Price",
    printTotal: "Total:",
    printNotesTitle: "Notes:",
    printNotesDefault: "Scope and pricing based on the work describe above.",
    errClient: "Please select a client from the list.",
    errItems: "You must add at least one item or material to the list.",
    unids: "units",
    connecting: "Loading system...",
    loginTitle: "System Access",
    loginDesc: "Enter your credentials to continue.",
    emailLabel: "Email Address",
    passLabel: "Password",
    loginBtn: "Log In",
    loginErr: "Invalid email or password.",
    logout: "Log Out"
  }
};

export default function App() {
  const [user, setUser] = useState<any>({ uid: 'admin', email: 'admin@dioskos.com' });
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState('es'); 
  const t = translations[lang];

  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [companySettings, setCompanySettings] = useState({
    companyName: "Diosko's",
    email: 'dioskohomereno@gmail.com',
    phone: '540 810 9924',
    logoUrl: ''
  });
  
  const [viewState, setViewState] = useState('list'); 
  const [currentDoc, setCurrentDoc] = useState(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Fetcher
  useEffect(() => {
    if (!user) return;

    const clientsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'clients');
    const docsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'documents');
    const settingsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile');

    const unsubClients = onSnapshot(clientsRef, (snapshot) => {
      setClients(snapshot.docs.map(d => ({ ...d.data(), id: d.id })));
    }, (error) => console.error(error));

    const unsubDocs = onSnapshot(docsRef, (snapshot) => {
      setDocuments(snapshot.docs.map(d => ({ ...d.data(), id: d.id })));
    }, (error) => console.error(error));

    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setCompanySettings(docSnap.data());
      }
    }, (error) => console.error(error));

    return () => {
      unsubClients();
      unsubDocs();
      unsubSettings();
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const addClient = async (clientData) => {
    if (!user) return;
    const newId = Date.now().toString();
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'clients', newId);
    await setDoc(docRef, { ...clientData, id: newId });
  };

  const addDocument = async (docData) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'documents', docData.id);
    await setDoc(docRef, docData);
  };

  const saveSettings = async (settingsData) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile');
    await setDoc(docRef, settingsData);
  };

  const getClient = (id) => {
    return clients.find(c => c.id === id) || { name: 'Cliente Desconocido', address: t.unregistered };
  };

  const handleCreateDocument = (type) => {
    setActiveTab(type);
    setViewState('create');
    setCurrentDoc({ type });
  };
  
  // --- RENDER MAIN APP IF LOGGED IN ---
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 print:hidden flex flex-col">
        <div className="p-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-blue-400 leading-tight">
            Diosko's
          </h1>
          <p className="text-xs text-slate-400 mt-2">{t.appSubtitle}</p>
        </div>
        <nav className="mt-4 flex flex-col space-y-1 px-4 flex-1">
          <button onClick={() => { setActiveTab('dashboard'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Users className="w-5 h-5 mr-3" /> {t.dashboard}
          </button>
          <button onClick={() => { setActiveTab('clients'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'clients' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Users className="w-5 h-5 mr-3" /> {t.clients}
          </button>
          <button onClick={() => { setActiveTab('proformas'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'proformas' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <FileText className="w-5 h-5 mr-3" /> {t.quotes}
          </button>
          <button onClick={() => { setActiveTab('recibos'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'recibos' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Receipt className="w-5 h-5 mr-3" /> {t.invoices}
          </button>
          <div className="pt-6 mt-6 border-t border-slate-800"></div>
          <button onClick={() => { setActiveTab('settings'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <Settings className="w-5 h-5 mr-3" /> {t.settings}
          </button>
          
          {/* Logout Button */}
          <button onClick={handleLogout} className="flex items-center px-4 py-3 rounded-lg transition-colors text-red-400 hover:bg-slate-800 mt-2">
            <LogOut className="w-5 h-5 mr-3" /> {t.logout}
          </button>
        </nav>

        {/* Language Toggle */}
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex w-full items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm">
            <Globe className="w-4 h-4 mr-2" />
            {lang === 'es' ? 'English Version' : 'Versión Español'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto bg-gray-100 print:p-0 print:bg-white">
        
        {/* Dashboard View */}
        {activeTab === 'dashboard' && viewState === 'list' && (
          <div className="space-y-6 print:hidden">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{t.overview}</h2>
              <p className="text-slate-500">{t.welcome}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-700">{t.clients}</h3>
                  <Users className="text-blue-500" />
                </div>
                <p className="text-3xl font-bold mt-4">{clients.length}</p>
                <button onClick={() => setActiveTab('clients')} className="text-sm text-blue-600 mt-2 hover:underline">{t.viewAll}</button>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-700">{t.quotes}</h3>
                  <FileText className="text-amber-500" />
                </div>
                <p className="text-3xl font-bold mt-4">{documents.filter(d => d.type === 'proforma').length}</p>
                <button onClick={() => handleCreateDocument('proforma')} className="text-sm text-amber-600 mt-2 hover:underline">{t.newQuoteBtn}</button>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-700">{t.invoices}</h3>
                  <Receipt className="text-emerald-500" />
                </div>
                <p className="text-3xl font-bold mt-4">{documents.filter(d => d.type === 'recibo').length}</p>
                <button onClick={() => handleCreateDocument('recibo')} className="text-sm text-emerald-600 mt-2 hover:underline">{t.newInvoiceBtn}</button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">{t.latestDocs}</h3>
              {documents.length === 0 ? (
                 <p className="text-slate-500 text-sm">{t.noDocs}</p>
              ) : (
                <div className="space-y-3">
                  {documents.slice().reverse().slice(0, 5).map(doc => (
                    <div key={doc.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full mr-2 ${doc.type === 'proforma' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {doc.type === 'proforma' ? t.quotes.toUpperCase() : t.invoices.toUpperCase()}
                        </span>
                        <span className="font-medium text-slate-700">{getClient(doc.clientId).name}</span>
                        <span className="text-slate-400 text-sm ml-2">({doc.date})</span>
                      </div>
                      <div className="font-bold text-slate-800">
                        ${doc.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clients View */}
        {activeTab === 'clients' && viewState === 'list' && (
          <ClientManager clients={clients} onAddClient={addClient} t={t} />
        )}

        {/* Proformas & Recibos List View */}
        {(activeTab === 'proformas' || activeTab === 'recibos') && viewState === 'list' && (
          <div className="print:hidden space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800 capitalize">
                {activeTab === 'proformas' ? t.quotes : t.invoices}
              </h2>
              <button 
                onClick={() => handleCreateDocument(activeTab.slice(0, -1))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors"
              >
                <Plus className="w-5 h-5 mr-1" /> {t.newBtn}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-medium">{t.date}</th>
                      <th className="p-4 font-medium">{t.client}</th>
                      <th className="p-4 font-medium">{t.total}</th>
                      <th className="p-4 font-medium text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.filter(d => d.type === activeTab.slice(0, -1)).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500">
                          {t.noDocsType}
                        </td>
                      </tr>
                    ) : (
                      documents.filter(d => d.type === activeTab.slice(0, -1)).map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50">
                          <td className="p-4 text-slate-600">{doc.date}</td>
                          <td className="p-4 font-medium text-slate-800">{getClient(doc.clientId).name}</td>
                          <td className="p-4 font-bold text-slate-800">${doc.total.toFixed(2)}</td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => { setCurrentDoc(doc); setViewState('view'); }}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              {t.viewPrint}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings View */}
        {activeTab === 'settings' && viewState === 'list' && (
          <SettingsManager settings={companySettings} onSave={saveSettings} t={t} />
        )}

        {/* Document Creation Form */}
        {viewState === 'create' && (
          <DocumentForm 
            type={currentDoc?.type || 'proforma'} 
            clients={clients} 
            t={t}
            onSave={async (newDoc) => {
              await addDocument(newDoc);
              setViewState('list');
            }}
            onCancel={() => setViewState('list')}
          />
        )}

        {/* Document Print/View */}
        {viewState === 'view' && currentDoc && (
          <PrintableView 
            doc={currentDoc} 
            client={getClient(currentDoc.clientId)}
            settings={companySettings}
            lang={lang}
            t={t}
            onBack={() => setViewState('list')} 
          />
        )}

      </main>
    </div>
  );
}

// --- LOGIN COMPONENT ---
function LoginScreen({ t, lang, setLang }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 font-sans">
      
      {/* Language Toggle for Login */}
      <div className="absolute top-4 right-4">
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex items-center px-4 py-2 bg-white shadow-sm hover:bg-slate-50 text-slate-600 rounded-full transition-colors text-sm font-medium border border-slate-200">
          <Globe className="w-4 h-4 mr-2" />
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-[#2b3a8c] p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Diosko's</h2>
          <p className="text-blue-100 mt-2 text-sm">{t.loginTitle}</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
                {t.loginErr}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.emailLabel}</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b3a8c] outline-none transition-shadow"
                placeholder="correo@ejemplo.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.passLabel}</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2b3a8c] outline-none transition-shadow"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#2b3a8c] hover:bg-blue-900 text-white font-bold py-3.5 px-4 rounded-lg transition-colors mt-2"
            >
              {t.loginBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (Settings, Clients, Form, Print) ---

function SettingsManager({ settings, onSave, t }) {
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 print:hidden max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t.configTitle}</h2>
        <p className="text-slate-500">{t.configDesc}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.compName}</label>
          <input 
            type="text" 
            value={formData.companyName}
            onChange={e => setFormData({...formData, companyName: e.target.value})}
            placeholder="Ej. Diosko's"
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.email}</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="correo@ejemplo.com"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="000 000 0000"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.logoUrl}</label>
          <input 
            type="url" 
            value={formData.logoUrl}
            onChange={e => setFormData({...formData, logoUrl: e.target.value})}
            placeholder="https://ejemplo.com/milogo.png"
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="text-xs text-slate-500 mt-1">{t.logoHint}</p>
        </div>
        
        <div className="pt-4 flex items-center justify-end">
          {saved && <span className="text-emerald-600 flex items-center mr-4"><CheckCircle2 className="w-5 h-5 mr-1"/> {t.saved}</span>}
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center">
            <Save className="w-5 h-5 mr-2" /> {t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
}

function ClientManager({ clients, onAddClient, t }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', address: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    
    await onAddClient(newClient);
    setNewClient({ name: '', phone: '', address: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 print:hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.dirClients}</h2>
          <p className="text-slate-500">{t.dirDesc}</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors">
            <Plus className="w-5 h-5 mr-1" /> {t.newClient}
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">{t.addClient}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.fullName}</label>
              <input type="text" required className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="Ej. Juan Pérez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.phone}</label>
              <input type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} placeholder="Ej. 8888-8888" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.address}</label>
              <input type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} placeholder="..." />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
              {t.cancel}
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center">
              <Save className="w-4 h-4 mr-2" /> {t.saveClient}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.length === 0 && !isAdding && (
          <div className="col-span-full bg-white p-8 text-center rounded-xl border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">{t.noClients}</p>
            <button onClick={() => setIsAdding(true)} className="text-blue-600 font-medium mt-2 hover:underline">{t.addFirst}</button>
          </div>
        )}
        {clients.map(client => (
          <div key={client.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800">{client.name}</h3>
            <p className="text-slate-600 text-sm mt-2 flex-1">
              <span className="font-medium">Tel:</span> {client.phone || t.unregistered}<br/>
              <span className="font-medium">Dir:</span> {client.address || t.unregistered}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentForm({ type, clients, onSave, onCancel, t }) {
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [newItem, setNewItem] = useState({ desc: '', qty: 1, price: 0 });

  const total = useMemo(() => items.reduce((sum, item) => sum + (item.qty * item.price), 0), [items]);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.desc || newItem.price <= 0) return;
    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({ desc: '', qty: 1, price: 0 });
    setErrorMsg('');
  };

  const handleRemoveItem = (id) => setItems(items.filter(item => item.id !== id));

  const handleSave = () => {
    if (!clientId) return setErrorMsg(t.errClient);
    if (items.length === 0) return setErrorMsg(t.errItems);
    onSave({ id: Date.now().toString(), type, clientId, date, items, total, notes });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 print:hidden">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 capitalize">{t.createDoc} {type === 'proforma' ? t.quotes : t.invoices}</h2>
        <button onClick={onCancel} className="text-slate-500 hover:text-slate-800"><ArrowLeft className="w-6 h-6" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.client} *</label>
          <select value={clientId} onChange={(e) => { setClientId(e.target.value); setErrorMsg(''); }} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value="">{t.selectClient}</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {clients.length === 0 && <p className="text-xs text-amber-600 mt-1">{t.clientWarn}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.date}</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">{t.details}</h3>
        
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-slate-600 mb-1">{t.desc}</label>
            <input type="text" value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} placeholder="Ej. Baseboards, Doors..." className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          <div className="w-full md:w-24">
            <label className="block text-xs font-medium text-slate-600 mb-1">{t.qty}</label>
            <input type="number" min="1" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: Number(e.target.value)})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          <div className="w-full md:w-32">
            <label className="block text-xs font-medium text-slate-600 mb-1">{t.unitPrice}</label>
            <input type="number" min="0" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>
          <button onClick={handleAddItem} className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white p-2 rounded-md font-medium flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 mr-1" /> {t.add}
          </button>
        </div>

        {items.length > 0 ? (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr><th className="p-3">{t.desc}</th><th className="p-3 text-center">{t.qty}</th><th className="p-3 text-right">{t.unitPrice}</th><th className="p-3 text-right">{t.subtotal}</th><th className="p-3 text-center"></th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 font-medium text-slate-800">{item.desc}</td><td className="p-3 text-center">{item.qty}</td><td className="p-3 text-right">${item.price.toFixed(2)}</td><td className="p-3 text-right font-semibold">${(item.qty * item.price).toFixed(2)}</td>
                    <td className="p-3 text-center"><button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-500">{t.notesInfo}</div>
        )}
      </div>

      {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm font-medium">{errorMsg}</div>}

      <div className="flex flex-col md:flex-row justify-between items-start pt-4 border-t border-slate-200">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <label className="block text-sm font-medium text-slate-700 mb-1">{t.notes}</label>
          <textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.notesPlaceholder} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
        </div>
        
        <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center text-lg font-bold text-slate-800">
            <span>{t.total}:</span><span>${total.toFixed(2)}</span>
          </div>
          <button onClick={handleSave} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-colors">
            <Save className="w-5 h-5 mr-2" /> {t.saveDoc}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrintableView({ doc, client, settings, lang, t, onBack }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="print:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-900 font-medium"><ArrowLeft className="w-5 h-5 mr-1" /> {t.back}</button>
        <button onClick={() => window.print()} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors"><Printer className="w-5 h-5 mr-2" /> {t.print}</button>
      </div>

      <div className="bg-white print:shadow-none print:border-none shadow-md">
        <div className="h-4 w-full bg-[#2b3a8c] mb-10 print:block"></div>
        <div className="px-10 md:px-14 pb-14">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-[#2b3a8c] text-xl md:text-2xl font-medium tracking-tight">{settings.companyName || "Diosko's"}</h2>
              <p className="text-slate-500 mt-1">{settings.email}</p>
              <p className="text-slate-500">{settings.phone}</p>
            </div>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-32 object-contain" />
            ) : (
              <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-slate-400 text-xs border-2 border-dashed border-slate-300 rounded text-center">Configura tu <br/> Logo</div>
            )}
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#2b3a8c] mb-1 tracking-tight">{doc.type === 'proforma' ? t.printQuoteLabel : t.printInvoiceLabel}</h1>
            <p className="text-[#2b3a8c] font-bold text-lg">{doc.type === 'proforma' ? t.printIssued : t.printSubmitted} {formatDate(doc.date)}</p>
          </div>

          <div className="mb-12">
            <h3 className="font-bold text-slate-800 text-lg mb-2">{doc.type === 'proforma' ? t.printQuoteFor : t.printInvoiceFor}</h3>
            <p className="text-slate-600 mb-1"><span className="text-slate-500 mr-1">{t.printClientName}</span> {client.name}</p>
            <p className="text-slate-600"><span className="text-slate-500 mr-1">{t.printJobAddress}</span> {client.address}</p>
          </div>

          <hr className="border-t border-slate-300 mb-6" />

          <table className="w-full text-left mb-4">
            <thead>
              <tr><th className="pb-3 pt-2 text-[#2b3a8c] text-xl font-bold">{t.printDesc}</th><th className="pb-3 pt-2 text-[#2b3a8c] text-xl font-bold text-right">{t.printPrice}</th></tr>
            </thead>
            <tbody className="border-t border-slate-300">
              {doc.items.map((item, idx) => (
                <tr key={idx} className="even:bg-slate-100/70">
                  <td className="py-3 px-2 text-slate-900">{item.desc} {item.qty > 1 && <span className="text-sm text-slate-500 ml-2">({item.qty} {t.unids})</span>}</td>
                  <td className="py-3 px-2 text-right text-slate-600">${(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end items-center mb-16 border-t border-slate-300 pt-3">
            <span className="text-2xl text-[#2b3a8c] mr-6">{t.printTotal}</span><span className="text-xl font-bold text-slate-900">${doc.total.toFixed(2)}</span>
          </div>

          <div>
            <h3 className="text-3xl text-[#2b3a8c] mb-5 tracking-tight font-light">{t.printNotesTitle}</h3>
            <ul className="text-slate-600 space-y-2 ml-10 list-none text-sm md:text-base">
              {doc.notes && <li className="relative before:content-['*'] before:absolute before:-left-5 before:text-slate-600">{doc.notes}</li>}
              <li className="relative before:content-['*'] before:absolute before:-left-5 before:text-slate-600">{t.printNotesDefault}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}