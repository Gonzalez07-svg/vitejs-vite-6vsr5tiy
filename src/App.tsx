import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase'; 
import { 
  collection, onSnapshot, doc, setDoc, query, deleteDoc 
} from 'firebase/firestore';
import {
  Users, FileText, Receipt, Plus, Trash2, Printer, ArrowLeft, Save, Settings, CheckCircle2, Globe, UploadCloud, Edit
} from 'lucide-react';

const appId = "dioskos-app-oficial";
const fixedUserId = "admin_dioskos";

// --- DICCIONARIO DE TRADUCCIONES ---
const translations: any = {
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
    viewPrint: "Ver / PDF",
    edit: "Editar",
    delete: "Eliminar",
    newBtn: "Nuevo",
    dirClients: "Directorio de Clientes",
    dirDesc: "Mantén el historial de las personas a las que les trabajas.",
    newClient: "Nuevo Cliente",
    addClient: "Datos del Cliente",
    fullName: "Nombre Completo *",
    phone: "Teléfono / WhatsApp",
    address: "Dirección (Opcional)",
    cancel: "Cancelar",
    saveClient: "Guardar Cliente",
    noClients: "No tienes clientes registrados.",
    addFirst: "Agrega tu primer cliente",
    unregistered: "No registrado",
    createDoc: "Documento:",
    selectClient: "-- Seleccionar Cliente --",
    clientWarn: "Primero debes registrar un cliente en la sección 'Clientes'.",
    details: "Detalle de Trabajos / Materiales",
    desc: "Descripción del Trabajo",
    qty: "Cant.",
    unitPrice: "Precio Unit.",
    subtotal: "Subtotal",
    add: "Agregar",
    notesInfo: "Agrega los trabajos o materiales usando el formulario de arriba.",
    notes: "Notas Adicionales (Opcional)",
    notesPlaceholder: "Añade notas extra aquí si las necesitas...",
    saveDoc: "Guardar Documento",
    back: "Volver",
    print: "Imprimir / Guardar PDF",
    configTitle: "Configuración de Empresa",
    configDesc: "Estos datos aparecerán en los encabezados de tus facturas y proformas.",
    compName: "Nombre de la Empresa",
    email: "Correo Electrónico",
    logoUrl: "Logo de la Empresa",
    logoHint: "Haz clic para subir una imagen desde tu dispositivo (JPG, PNG).",
    saveChanges: "Guardar Cambios",
    saved: "Guardado correctamente",
    printQuoteLabel: "PROFORMA",
    printInvoiceLabel: "RECIBO",
    printIssued: "Fecha de Emisión:",
    printSubmitted: "Fecha:",
    printQuoteFor: "COTIZACIÓN PARA:",
    printInvoiceFor: "FACTURADO A:",
    printClientName: "Cliente:",
    printJobAddress: "Dirección:",
    printDesc: "DESCRIPCIÓN",
    printPrice: "PRECIO",
    printQty: "CANT.",
    printSub: "TOTAL",
    printTotal: "TOTAL:",
    printNotesTitle: "NOTAS:",
    printNotesDefault: "Alcance y precios basados en el trabajo descrito arriba.",
    errClient: "Por favor, selecciona un cliente.",
    errItems: "Debes agregar al menos un trabajo o material.",
    unids: "unids",
    confirmDelete: "¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.",
    confirmDeleteClient: "¿Estás seguro de que deseas eliminar este cliente? Esto podría afectar a sus documentos existentes."
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
    viewPrint: "View / PDF",
    edit: "Edit",
    delete: "Delete",
    newBtn: "New",
    dirClients: "Client Directory",
    dirDesc: "Keep track of the people you work for.",
    newClient: "Add New Client",
    addClient: "Client Details",
    fullName: "Full Name *",
    phone: "Phone / WhatsApp",
    address: "Address (Optional)",
    cancel: "Cancel",
    saveClient: "Save Client",
    noClients: "You have no registered clients.",
    addFirst: "Add your first client",
    unregistered: "Not registered",
    createDoc: "Document:",
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
    saveDoc: "Save Document",
    back: "Back",
    print: "Print / Save PDF",
    configTitle: "Company Settings",
    configDesc: "This data will appear in the headers of your invoices and quotes.",
    compName: "Company Name",
    email: "Email Address",
    logoUrl: "Company Logo",
    logoHint: "Click to upload an image from your device (JPG, PNG).",
    saveChanges: "Save Changes",
    saved: "Saved successfully",
    printQuoteLabel: "QUOTE",
    printInvoiceLabel: "INVOICE",
    printIssued: "Date Issued:",
    printSubmitted: "Date:",
    printQuoteFor: "QUOTE FOR:",
    printInvoiceFor: "BILLED TO:",
    printClientName: "Client name:",
    printJobAddress: "Address:",
    printDesc: "DESCRIPTION",
    printPrice: "PRICE",
    printQty: "QTY",
    printSub: "TOTAL",
    printTotal: "TOTAL:",
    printNotesTitle: "NOTES:",
    printNotesDefault: "Scope and pricing based on the work describe above.",
    errClient: "Please select a client from the list.",
    errItems: "You must add at least one item or material to the list.",
    unids: "units",
    confirmDelete: "Are you sure you want to delete this document? This cannot be undone.",
    confirmDeleteClient: "Are you sure you want to delete this client? This might affect existing documents."
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState('es'); 
  const t = translations[lang];

  const [clients, setClients] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [companySettings, setCompanySettings] = useState({
    companyName: "Diosko's Home Renovations LLC",
    email: 'dioskohomereno@gmail.com',
    phone: '540 810 9924',
    logoUrl: '' 
  });
  
  const [viewState, setViewState] = useState('list'); 
  const [currentDoc, setCurrentDoc] = useState<any>(null);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const clientsRef = collection(db, 'artifacts', appId, 'users', fixedUserId, 'clients');
    const docsRef = collection(db, 'artifacts', appId, 'users', fixedUserId, 'documents');
    const settingsRef = doc(db, 'artifacts', appId, 'users', fixedUserId, 'settings', 'profile');

    const unsubClients = onSnapshot(clientsRef, (snapshot) => {
      setClients(snapshot.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    const unsubDocs = onSnapshot(docsRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
      setDocuments(docs.sort((a: any, b: any) => b.id - a.id));
    });

    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setCompanySettings(docSnap.data() as any);
      }
    });

    return () => { unsubClients(); unsubDocs(); unsubSettings(); };
  }, []);

  // --- FUNCIONES DE BASE DE DATOS ---
  const saveClientData = async (clientData: any) => {
    const id = clientData.id || Date.now().toString();
    const docRef = doc(db, 'artifacts', appId, 'users', fixedUserId, 'clients', id);
    await setDoc(docRef, { ...clientData, id });
  };

  const deleteClient = async (id: string) => {
    if (window.confirm(t.confirmDeleteClient)) {
      const docRef = doc(db, 'artifacts', appId, 'users', fixedUserId, 'clients', id);
      await deleteDoc(docRef);
    }
  };

  const saveDocumentData = async (docData: any) => {
    const id = docData.id || Date.now().toString();
    const docRef = doc(db, 'artifacts', appId, 'users', fixedUserId, 'documents', id);
    await setDoc(docRef, { ...docData, id });
  };

  const deleteDocument = async (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      const docRef = doc(db, 'artifacts', appId, 'users', fixedUserId, 'documents', id);
      await deleteDoc(docRef);
    }
  };

  const saveSettingsData = async (settingsData: any) => {
    const docRef = doc(db, 'artifacts', appId, 'users', fixedUserId, 'settings', 'profile');
    await setDoc(docRef, settingsData);
  };

  const getClient = (id: string) => {
    return clients.find(c => c.id === id) || { name: t.unregistered, address: '', phone: '' };
  };

  const handleCreateDocument = (type: string) => {
    setActiveTab(type + 's');
    setViewState('create');
    setCurrentDoc({ type }); // Inicializa un doc vacío para creación
  };
  
  // --- INTERFAZ PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1e293b] text-white flex-shrink-0 print:hidden flex flex-col shadow-xl z-10">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-white leading-tight flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">D</div>
            Diosko's
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide uppercase">{t.appSubtitle}</p>
        </div>
        <nav className="mt-4 flex flex-col space-y-1 px-4 flex-1">
          <button onClick={() => { setActiveTab('dashboard'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Globe className="w-5 h-5 mr-3" /> <span className="font-medium">{t.dashboard}</span>
          </button>
          <button onClick={() => { setActiveTab('clients'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'clients' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Users className="w-5 h-5 mr-3" /> <span className="font-medium">{t.clients}</span>
          </button>
          <button onClick={() => { setActiveTab('proformas'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'proformas' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <FileText className="w-5 h-5 mr-3" /> <span className="font-medium">{t.quotes}</span>
          </button>
          <button onClick={() => { setActiveTab('recibos'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'recibos' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Receipt className="w-5 h-5 mr-3" /> <span className="font-medium">{t.invoices}</span>
          </button>
          <div className="pt-6 mt-6 border-t border-slate-700/50"></div>
          <button onClick={() => { setActiveTab('settings'); setViewState('list'); }} className={`flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Settings className="w-5 h-5 mr-3" /> <span className="font-medium">{t.settings}</span>
          </button>
        </nav>

        {/* Language Toggle */}
        <div className="p-4 mt-auto">
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex w-full items-center justify-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm font-medium">
            <Globe className="w-4 h-4 mr-2 text-blue-400" />
            {lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-6xl mx-auto print:p-0 print:bg-white print:overflow-visible animate-in fade-in duration-300">
        
        {/* Dashboard */}
        {activeTab === 'dashboard' && viewState === 'list' && (
          <div className="space-y-8 print:hidden">
            <div><h2 className="text-3xl font-bold text-slate-800">{t.overview}</h2><p className="text-slate-500 mt-1">{t.welcome}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300/80 transition-all cursor-pointer">
                <div className="flex justify-between items-start"><div className="bg-blue-50 p-3 rounded-xl" onClick={() => setActiveTab('clients')}><Users className="text-blue-600 w-6 h-6" /></div></div>
                <div className="mt-4"><p className="text-4xl font-black text-slate-800" onClick={() => setActiveTab('clients')}>{clients.length}</p><h3 className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide cursor-pointer" onClick={() => setActiveTab('clients')}>{t.clients} Registrados</h3></div>
                <button onClick={() => { setActiveTab('clients'); setViewState('createClient'); }} className="absolute top-6 right-6 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl shadow-inner sm:opacity-0 group-hover:opacity-100 transition-opacity transition-transform group-hover:translate-y-0 translate-y-2">{t.newBtn}</button>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300/80 transition-all cursor-pointer">
                <div className="flex justify-between items-start"><div className="bg-amber-50 p-3 rounded-xl" onClick={() => setActiveTab('proformas')}><FileText className="text-amber-500 w-6 h-6" /></div></div>
                <div className="mt-4"><p className="text-4xl font-black text-slate-800" onClick={() => setActiveTab('proformas')}>{documents.filter(d => d.type === 'proforma').length}</p><h3 className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide cursor-pointer" onClick={() => setActiveTab('proformas')}>{t.quotes} Emitidas</h3></div>
                <button onClick={() => handleCreateDocument('proforma')} className="absolute top-6 right-6 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl shadow-inner sm:opacity-0 group-hover:opacity-100 transition-opacity transition-transform group-hover:translate-y-0 translate-y-2">{t.newBtn}</button>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300/80 transition-all cursor-pointer">
                <div className="flex justify-between items-start"><div className="bg-emerald-50 p-3 rounded-xl" onClick={() => setActiveTab('recibos')}><Receipt className="text-emerald-500 w-6 h-6" /></div></div>
                <div className="mt-4"><p className="text-4xl font-black text-slate-800" onClick={() => setActiveTab('recibos')}>{documents.filter(d => d.type === 'recibo').length}</p><h3 className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide cursor-pointer" onClick={() => setActiveTab('recibos')}>{t.invoices} Emitidos</h3></div>
                <button onClick={() => handleCreateDocument('recibo')} className="absolute top-6 right-6 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl shadow-inner sm:opacity-0 group-hover:opacity-100 transition-opacity transition-transform group-hover:translate-y-0 translate-y-2">{t.newBtn}</button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">{t.latestDocs}</h3>
              {documents.length === 0 ? <p className="text-slate-500 text-sm">{t.noDocs}</p> : (
                <div className="space-y-3">
                  {documents.slice().reverse().slice(0, 5).map(doc => (
                    <div key={doc.id} onClick={() => { setCurrentDoc(doc); setViewState('view'); }} className="flex justify-between items-center p-4 hover:bg-slate-50/50 rounded-xl border border-transparent transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${doc.type === 'proforma' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {doc.type === 'proforma' ? t.quotes.toUpperCase() : t.invoices.toUpperCase()}
                        </span>
                        <span className="font-semibold text-slate-800">{getClient(doc.clientId).name}</span>
                        <span className="text-slate-400 text-xs font-medium ml-1 hidden md:inline">({doc.date})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-black text-slate-900">${doc.total.toFixed(2)}</div>
                        <button className="bg-white border border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                          {t.viewPrint}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clients List & Form */}
        {activeTab === 'clients' && (viewState === 'list' || viewState === 'createClient') && (
          <ClientManager 
            clients={clients} 
            onSaveClient={saveClientData} 
            onDeleteClient={deleteClient} 
            t={t} 
            startAdding={viewState === 'createClient'} 
            onAddingDone={() => setViewState('list')} 
          />
        )}

        {/* Proformas & Recibos List */}
        {(activeTab === 'proformas' || activeTab === 'recibos') && viewState === 'list' && (
          <div className="print:hidden space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-bold text-slate-800 capitalize">{activeTab === 'proformas' ? t.quotes : t.invoices}</h2>
              <button onClick={() => handleCreateDocument(activeTab.slice(0, -1))} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center font-bold shadow-md shadow-blue-900/10 transition-all hover:shadow-lg">
                <Plus className="w-5 h-5 mr-2" /> {t.newBtn} {activeTab === 'proformas' ? 'Proforma' : 'Recibo'}
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden shadow-inner">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-200/60">
                  <tr>
                    <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wide">{t.date}</th>
                    <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wide">{t.client}</th>
                    <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wide">{t.total}</th>
                    <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wide text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.filter(d => d.type === activeTab.slice(0, -1)).length === 0 ? (
                    <tr><td colSpan={4} className="p-16 text-center text-slate-500 font-medium">{t.noDocsType}</td></tr>
                  ) : (
                    documents.filter(d => d.type === activeTab.slice(0, -1)).map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-5 text-slate-600 font-medium text-sm">{doc.date}</td>
                        <td className="p-5 font-bold text-slate-800">{getClient(doc.clientId).name}</td>
                        <td className="p-5 font-black text-slate-900">${doc.total.toFixed(2)}</td>
                        <td className="p-5 text-right flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setCurrentDoc(doc); setViewState('view'); }} className="bg-white border border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors" title={t.viewPrint}>
                            {t.viewPrint}
                          </button>
                          <button onClick={() => { setCurrentDoc(doc); setViewState('edit'); }} className="bg-white border border-slate-200 text-amber-500 hover:text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg shadow-sm transition-colors" title={t.edit}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteDocument(doc.id)} className="bg-white border border-slate-200 text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg shadow-sm transition-colors" title={t.delete}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && viewState === 'list' && (
          <SettingsManager settings={companySettings} onSave={saveSettingsData} t={t} />
        )}

        {/* Document Creation / Edit Form */}
        {(viewState === 'create' || viewState === 'edit') && (
          <DocumentForm 
            type={currentDoc?.type || 'proforma'} 
            initialDoc={viewState === 'edit' ? currentDoc : null}
            clients={clients} 
            t={t}
            onSave={async (savedDoc: any) => { await saveDocumentData(savedDoc); setViewState('list'); }}
            onCancel={() => setViewState('list')}
          />
        )}

        {/* Document Print/View */}
        {viewState === 'view' && currentDoc && (
          <PrintableView 
            doc={currentDoc} 
            client={getClient(currentDoc.clientId)}
            settings={companySettings} lang={lang} t={t}
            onBack={() => setViewState('list')} 
          />
        )}
      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES
// ==========================================

function SettingsManager({ settings, onSave, t }: any) {
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); 
    await onSave(formData);
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
      <div><h2 className="text-3xl font-bold text-slate-800">{t.configTitle}</h2><p className="text-slate-500 mt-1">{t.configDesc}</p></div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 border-dashed text-center relative overflow-hidden transition-colors hover:border-blue-400">
          <label className="block text-sm font-bold text-slate-700 mb-4">{t.logoUrl}</label>
          {formData.logoUrl ? (
            <div className="relative inline-block animate-in zoom-in-75 duration-300">
              <img src={formData.logoUrl} alt="Logo Preview" className="h-28 object-contain mx-auto bg-white p-3 rounded-xl shadow-sm border border-slate-200" />
              <button type="button" onClick={() => setFormData({...formData, logoUrl: ''})} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"><Trash2 className="w-4 h-4"/></button>
            </div>
          ) : (
            <label className="cursor-pointer inline-flex flex-col items-center justify-center p-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3"><UploadCloud className="w-8 h-8" /></div>
              <span className="text-sm text-slate-500 font-semibold">{t.logoHint}</span>
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>

        <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.compName}</label><input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.email}</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900" /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.phone}</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900" /></div>
        </div>
        
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-end">
          {saved && <span className="text-emerald-600 flex items-center mr-4 font-bold bg-emerald-50 px-3.5 py-2 rounded-lg text-sm"><CheckCircle2 className="w-5 h-5 mr-1.5"/> {t.saved}</span>}
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl flex items-center font-bold shadow-md shadow-blue-900/10 transition-all"><Save className="w-5 h-5 mr-2.5" /> {t.saveChanges}</button>
        </div>
      </form>
    </div>
  );
}

function ClientManager({ clients, onSaveClient, onDeleteClient, t, startAdding, onAddingDone }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [clientForm, setClientForm] = useState({ id: '', name: '', phone: '', address: '' });

  useEffect(() => {
    if (startAdding) {
      setClientForm({ id: '', name: '', phone: '', address: '' });
      setIsAdding(true);
    }
  }, [startAdding]);

  const closeForm = () => {
    setIsAdding(false);
    if (onAddingDone) onAddingDone();
  };

  const handleAddNewClient = () => {
    setClientForm({ id: '', name: '', phone: '', address: '' });
    setIsAdding(true);
  };

  const handleSave = async (e: any) => {
    e.preventDefault(); 
    if (!clientForm.name) return;
    await onSaveClient(clientForm);
    setClientForm({ id: '', name: '', phone: '', address: '' }); 
    closeForm();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div><h2 className="text-3xl font-bold text-slate-800">{t.dirClients}</h2><p className="text-slate-500 mt-1">{t.dirDesc}</p></div>
        {!isAdding && <button onClick={handleAddNewClient} className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center font-bold shadow-md shadow-blue-900/10"><Plus className="w-5 h-5 mr-2" /> {t.newClient}</button>}
      </div>
      {isAdding && (
        <form onSubmit={handleSave} className="bg-white p-7 rounded-2xl border border-slate-200/60 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-slate-800 mb-5 border-b pb-3">{t.addClient}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.fullName}</label><input type="text" required className="w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.phone}</label><input type="text" className="w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={clientForm.phone} onChange={e => setClientForm({...clientForm, phone: e.target.value})} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">{t.address}</label><input type="text" className="w-full p-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={clientForm.address} onChange={e => setClientForm({...clientForm, address: e.target.value})} /></div>
          </div>
          <div className="mt-7 flex justify-end gap-3.5 border-t pt-7">
            <button type="button" onClick={closeForm} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">{t.cancel}</button>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center font-bold shadow-sm transition-transform hover:shadow-md"><Save className="w-4 h-4 mr-2" /> {t.saveClient}</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.length === 0 && !isAdding && <div className="col-span-full bg-white p-14 text-center rounded-2xl border border-dashed border-slate-300"><p className="text-slate-500 font-medium text-lg">{t.noClients}</p></div>}
        {clients.map((client: any) => (
          <div key={client.id} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group relative">
            <h3 className="text-xl font-bold text-slate-800 pr-16">{client.name}</h3>
            <div className="mt-4 space-y-2.5">
              <p className="text-slate-600 text-sm flex"><span className="font-bold w-12 text-slate-500">Tel:</span> <span>{client.phone || t.unregistered}</span></p>
              <p className="text-slate-600 text-sm flex"><span className="font-bold w-12 text-slate-500">Dir:</span> <span>{client.address || t.unregistered}</span></p>
            </div>
            <div className="absolute top-5 right-5 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setClientForm(client); setIsAdding(true); }} className="text-amber-500 hover:text-amber-600 p-1.5 bg-amber-50 rounded-lg transition-colors" title={t.edit}><Edit className="w-4 h-4" /></button>
              <button onClick={() => onDeleteClient(client.id)} className="text-red-400 hover:text-red-600 p-1.5 bg-red-50 rounded-lg transition-colors" title={t.delete}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentForm({ type, initialDoc, clients, onSave, onCancel, t }: any) {
  const [clientId, setClientId] = useState(initialDoc?.clientId || '');
  const [date, setDate] = useState(initialDoc?.date || new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<any[]>(initialDoc?.items || []);
  const [notes, setNotes] = useState(initialDoc?.notes || '');
  
  const [newItem, setNewItem] = useState({ desc: '', qty: 1, price: '' as number|string });
  
  const total = items.reduce((sum, item) => sum + ((Number(item.qty) || 0) * (Number(item.price) || 0)), 0);

  const handleAddItem = (e: any) => {
    e.preventDefault(); 
    if (!newItem.desc || Number(newItem.price) <= 0) return;
    setItems([...items, { ...newItem, price: Number(newItem.price), id: Date.now() }]);
    setNewItem({ desc: '', qty: 1, price: '' });
  };

  // Función mágica para editar los valores en línea en la tabla
  const handleUpdateItem = (id: number, field: string, value: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        let parsedValue: string | number = value;
        if (field === 'qty' || field === 'price') {
          parsedValue = value === '' ? '' : Number(value);
        }
        return { ...item, [field]: parsedValue };
      }
      return item;
    }));
  };

  const handleSave = () => {
    if (!clientId) return alert(t.errClient);
    if (items.length === 0) return alert(t.errItems);
    
    // Convertimos cualquier string vacío a 0 por seguridad antes de guardar
    const cleanItems = items.map(item => ({
      ...item,
      qty: Number(item.qty) || 1,
      price: Number(item.price) || 0
    }));

    const docId = initialDoc?.id || Date.now().toString();
    const shortId = initialDoc?.docNumber || Math.floor(10000 + Math.random() * 90000).toString();
    
    onSave({ id: docId, docNumber: shortId, type, clientId, date, items: cleanItems, total, notes });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200/60 p-6 md:p-10 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-7">
        <h2 className="text-3xl font-extrabold capitalize text-slate-900">
          {initialDoc ? t.edit : t.createDoc} {type === 'proforma' ? 'Proforma' : 'Recibo'}
        </h2>
        <button onClick={onCancel} className="p-2.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ArrowLeft className="w-6 h-6" /></button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2.5">{t.client} *</label>
          <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full p-4 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500 bg-white shadow-inner text-slate-900">
            <option value="">{t.selectClient}</option>
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2.5">{t.date}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-4 border border-slate-300 rounded-xl font-semibold focus:ring-2 focus:ring-blue-500 shadow-inner" />
        </div>
      </div>

      <div className="mb-10 bg-slate-50/70 p-7 rounded-2xl border border-slate-200">
        <h3 className="font-extrabold text-slate-800 mb-5 border-b pb-3 uppercase tracking-wide text-sm">{t.details}</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end mb-8">
          <div className="flex-1 w-full"><label className="block text-xs font-bold text-slate-600 mb-2.5">{t.desc}</label><input type="text" placeholder="Ej. Puerta de madera..." value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} className="w-full p-3.5 border rounded-xl shadow-inner bg-white" /></div>
          <div className="w-full md:w-28"><label className="block text-xs font-bold text-slate-600 mb-2.5">{t.qty}</label><input type="number" min="1" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: Number(e.target.value)})} className="w-full p-3.5 border rounded-xl shadow-inner bg-white" /></div>
          <div className="w-full md:w-36"><label className="block text-xs font-bold text-slate-600 mb-2.5">{t.unitPrice} ($)</label><input type="number" min="0" placeholder="0.00" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full p-3.5 border rounded-xl shadow-inner bg-white" /></div>
          <button onClick={handleAddItem} className="w-full md:w-auto bg-slate-800 hover:bg-slate-950 text-white p-3.5 rounded-xl flex justify-center items-center font-bold transition-colors"><Plus className="w-5 h-5 md:mr-0 mr-2" /> <span className="md:hidden inline">Agregar</span></button>
        </div>
        
        {items.length > 0 && (
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600"><tr><th className="p-4 font-bold uppercase tracking-wider">{t.printDesc}</th><th className="p-4 font-bold text-center uppercase tracking-wider">{t.qty}</th><th className="p-4 font-bold text-right uppercase tracking-wider">{t.printPrice}</th><th className="p-4 font-bold text-right uppercase tracking-wider">{t.subtotal}</th><th></th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it: any) => (
                  <tr key={it.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Campos editables integrados en la tabla */}
                    <td className="p-4 pr-6">
                      <input 
                        type="text" 
                        value={it.desc} 
                        onChange={(e) => handleUpdateItem(it.id, 'desc', e.target.value)} 
                        className="w-full bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:border-solid outline-none p-1 font-medium text-slate-800 transition-colors" 
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        min="1" 
                        value={it.qty} 
                        onChange={(e) => handleUpdateItem(it.id, 'qty', e.target.value)} 
                        className="w-16 mx-auto text-center bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:border-solid outline-none p-1 font-bold text-slate-700 transition-colors block" 
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end items-center">
                        <span className="text-slate-500 font-medium mr-1">$</span>
                        <input 
                          type="number" 
                          min="0" 
                          value={it.price} 
                          onChange={(e) => handleUpdateItem(it.id, 'price', e.target.value)} 
                          className="w-20 text-right bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:border-solid outline-none p-1 font-medium text-slate-600 transition-colors" 
                        />
                      </div>
                    </td>
                    <td className="p-4 text-right font-black text-slate-950">
                      ${((Number(it.qty) || 0) * (Number(it.price) || 0)).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => setItems(items.filter(i => i.id !== it.id))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-10 pt-8 border-t border-slate-100">
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-bold text-slate-700 mb-2.5">{t.notes}</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.notesPlaceholder} className="w-full p-4.5 border border-slate-300 rounded-xl resize-none shadow-inner" rows={4}></textarea>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-end">
          <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200 text-right mb-6">
            <span className="text-slate-500 font-bold uppercase tracking-widest mr-5">{t.total}</span>
            <span className="text-5xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</span>
          </div>
          <button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4.5 rounded-2xl font-black text-xl flex justify-center items-center shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl"><Save className="w-6 h-6 mr-3"/> {t.saveDoc}</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DISEÑO DEL PDF / IMPRESIÓN COMPACTO
// ==========================================
function PrintableView({ doc, client, settings, lang, t, onBack }: any) {
  
  const COLOR_BLUE = "#2b3a8c"; 

  const formatPrintDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    const originalTitle = document.title;
    const typeName = doc.type === 'proforma' ? 'Proforma' : 'Recibo';
    document.title = `${typeName} - ${client.name}`;
    
    return () => {
      document.title = originalTitle; 
    };
  }, [doc, client]);

  return (
    <div className="max-w-[850px] mx-auto bg-white print:p-0 print:shadow-none animate-in fade-in duration-300">
      
      <style>
        {`
          @media print {
            @page { margin: 0 !important; } 
            body { 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
              margin: 0;
              padding: 0;
            }
            .print-container { padding: 40px !important; }
          }
        `}
      </style>

      <div className="print:hidden flex justify-between items-center mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-slate-950 font-bold bg-white px-5 py-2.5 rounded-xl border shadow-sm transition-all"><ArrowLeft className="w-5 h-5 mr-2.5" /> {t.back}</button>
        <button onClick={() => window.print()} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold shadow-md shadow-blue-900/10 transition-all hover:shadow-lg"><Printer className="w-5 h-5 mr-2.5" /> {t.print}</button>
      </div>

      <div className="print-container relative bg-white min-h-[500px] print:min-h-0 mx-auto box-border overflow-hidden rounded-xl print:rounded-none">
        <div className="p-8 md:p-10 print:p-6">
          <div className="h-2 w-full mb-6" style={{ backgroundColor: COLOR_BLUE }}></div>

          <div className="flex justify-between items-start mb-6">
            <div className="text-sm font-medium space-y-0.5" style={{ color: "#777" }}>
              <p className="font-bold text-base mb-1" style={{ color: COLOR_BLUE }}>Diosko's Home Renovations LLC</p>
              {settings.email && <p>{settings.email}</p>}
              {settings.phone && <p>{settings.phone}</p>}
            </div>
            <div>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-28 h-auto object-contain" />
              ) : (
                <div className="text-lg font-black uppercase tracking-tight" style={{ color: COLOR_BLUE }}>Diosko's Home Renovations LLC</div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold capitalize mb-1" style={{ color: COLOR_BLUE }}>
              {doc.type === 'proforma' ? t.printQuoteLabel : t.printInvoiceLabel}
            </h2>
            <p className="text-xs font-semibold" style={{ color: COLOR_BLUE }}>
              {doc.type === 'proforma' ? t.printIssued : t.printSubmitted} {formatPrintDate(doc.date)}
            </p>
          </div>

          <div className="mb-6 text-sm">
            <p className="font-bold text-slate-700 mb-1">{doc.type === 'proforma' ? t.printQuoteFor : t.printInvoiceFor}</p>
            <p className="text-slate-500"><span className="mr-1">{t.printClientName}</span> {client.name}</p>
            {client.address && <p className="text-slate-500"><span className="mr-1">{t.printJobAddress}</span> {client.address}</p>}
          </div>

          <table className="w-full text-left border-collapse mb-1">
            <thead className="border-b-2" style={{ borderColor: COLOR_BLUE }}>
              <tr>
                <th className="py-2 font-bold text-sm" style={{ color: COLOR_BLUE }}>{t.printDesc}</th>
                <th className="py-2 font-bold text-sm text-right" style={{ color: COLOR_BLUE, width: '25%' }}>{t.printPrice}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {doc.items.map((item: any, idx: number) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                  <td className="py-2 px-2 text-slate-800 font-medium">
                    {item.desc} {item.qty > 1 ? <span className="text-slate-500 ml-1">(x{item.qty})</span> : ''}
                  </td>
                  <td className="py-2 px-2 text-slate-800 font-medium text-right">
                    ${(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t mb-4" style={{ borderColor: '#e2e8f0' }}></div>

          <div className="flex justify-end mb-6 pr-2">
            <div className="flex justify-between items-center w-64">
              <span className="text-base font-bold" style={{ color: COLOR_BLUE }}>{t.printTotal}</span>
              <span className="text-lg font-bold text-slate-900">${doc.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold mb-2" style={{ color: COLOR_BLUE }}>{t.printNotesTitle}</h4>
            <ul className="text-slate-600 text-xs font-medium space-y-1 list-disc ml-5">
              <li>{t.printNotesDefault}</li>
              {doc.notes && <li>{doc.notes}</li>}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}