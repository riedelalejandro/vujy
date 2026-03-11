# 🎓 Vujy — Prototipo HTML Navegable

**Prototipo interactivo para demostración previa a implementación** — Muestra cómo se ve y funciona Vujy para cada perfil de usuario.

## 📋 Índice

- [Descripción General](#descripción-general)
- [Perfiles Disponibles](#perfiles-disponibles)
- [Características Principales](#características-principales)
- [Cómo Usar el Prototipo](#cómo-usar-el-prototipo)
- [Estructura de Archivos](#estructura-de-archivos)
- [Funcionalidades Interactivas](#funcionalidades-interactivas)
- [Consideraciones de Diseño](#consideraciones-de-diseño)

---

## 📖 Descripción General

Este prototipo HTML navegable simula la experiencia de usuario de **Vujy** para cada uno de los cuatro perfiles principales del sistema:

1. **Padres/Tutores** — Resumen académico, pagos, comunicados
2. **Docentes** — Asistencia, calificaciones, generación de contenido
3. **Administradores** — Dashboard, morosidad, simulador financiero
4. **Alumnos** (por nivel educativo) — Actividades, misiones, tutor IA

### Propósito

- ✅ Validación visual de flujos de usuario
- ✅ Demostración a stakeholders antes de implementación
- ✅ Documentación interactiva del producto
- ✅ Base para diseño en alta fidelidad
- ✅ Prueba de conceptos multicanal (chat + UI estructurada)

---

## 🎭 Perfiles Disponibles

### 1️⃣ **Padre/Tutor** (`padre.html`)

**Journey P0:** Resumen Semanal → Ausencia → Pago

**Lo que puedes hacer:**
- 💬 Chat conversacional con el asistente IA
- 📊 Ver resumen semanal del alumno (asistencia, notas, tareas)
- ❌ Reportar ausencia naturalmente ("Mateo no va a ir mañana")
- 💳 Consultar deuda y pagar online
- 📅 Ver próximas actividades y eventos

**Interfaz:** Chat side-by-side con panel informativo | Tab Web completa

---

### 2️⃣ **Docente** (`docente.html`)

**Funcionalidades Core:** Asistencia, comunicados, notas, observaciones

**Lo que puedes hacer:**
- ⏰ Tomar asistencia (por voz o lista)
- 📢 Generar comunicados automáticos con IA
- 📝 Cargar calificaciones por voz
- 📔 Registrar observaciones pedagógicas durante el trimestre
- 🤖 Generar actividades educativas con IA
- 📋 Ver borrador de informe trimestral (generado automáticamente)

**Interfaz:** Feature cards + Formularios | Flexible por tarea

---

### 3️⃣ **Administrador** (`admin.html`)

**Enfoque:** Inteligencia financiera + Visibilidad institucional

**Lo que puedes hacer:**
- 📊 Ver KPIs del día (matrícula, asistencia, deuda, familias en riesgo)
- 💰 Gestionar morosidad (recordatorios, planes de pago)
- ⚠️ Detectar familias en riesgo de deserción
- 🎯 Simular escenarios financieros ("¿Qué pasa si subo 15% la cuota?")
- 🔔 Recibir alertas automáticas (urgencias, caídas académicas)
- 💬 Chat con asistente administrativo

**Interfaz:** Dashboard completo | Gráficos y tablas de datos

---

### 4️⃣ **Alumnos** (por nivel educativo)

#### **A. Inicial** (`alumno-inicial.html`)

Interfaz lúdica, sin palabras, narrada por voz.

**Lo que puedes hacer:**
- 🎮 Actividades visuales interactivas
- 🦁 Mascota virtual que crece con actividades
- 📊 Gamificación con estrellitas y sorpresas
- 📱 Interface táctil, 100% visual

---

#### **B. Primaria** (`alumno-primaria.html`)

Misiones gamificadas, progreso visible, lectura interactiva.

**Lo que puedes hacer:**
- 🎯 Completar misiones diarias (150 monedas c/u)
- 📖 Lectura interactiva en biblioteca digital
- 💰 Ganar monedas para personalizar avatar
- 📊 Ver progreso semanal por materia
- 🏆 Desbloquear logros y retos grupales

---

#### **C. Secundaria** (`alumno-secundaria.html`)

Agenda unificada, tutor IA, simulacros, portfolio digital, debate académico.

**Lo que puedes hacer:**
- 📅 Agenda unificada de tareas, pruebas, entregas
- 🤖 Tutor IA personal (explicaciones, resolución de problemas)
- 📊 Ver situación académica actual (promedio, tendencias)
- 💬 Foro de debate académico con moderación IA
- 📂 Portfolio digital de trabajos y logros

---

## ✨ Características Principales

### 🔄 Multicanal
- **Chat** — Interfaz conversacional (WhatsApp, App)
- **Web** — Dashboard y formularios completos
- **Simulación** — Mismo contenido en ambos canales

### 🤖 Asistente IA Conversacional
- Lenguaje natural (no comandos)
- Respuestas contextuales
- Función calling (ejecutar acciones reales)
- Disponible 24/7

### 📊 Datos Funcionales
- Datos realistas de ejemplo
- Casos de uso completos
- Estados críticos simulados (error, loading, vacío)

### 🎨 Diseño Responsivo
- Mobile-first
- Adaptable a tablet y desktop
- Touch-friendly

---

## 🚀 Cómo Usar el Prototipo

### Acceso Rápido

1. **Abre `index.html`** en tu navegador
2. **Selecciona un perfil** de la lista
3. **Interactúa** con los elementos (botones, inputs, tabs)
4. **Navega** entre diferentes vistas

### Recomendación de Flujos

#### **Si eres stakeholder/inversor:**
1. Comienza en Index
2. Lee la descripción de cada perfil
3. Abre Padre → sigue el journey completo (resumen → ausencia → pago)
4. Luego Admin → ve el simulador financiero
5. Termina en Alumno Secundaria → portfolio + debate

#### **Si eres diseñador/PM:**
1. Revisa cada perfil en orden
2. Prueba todos los botones y chips
3. Abre DevTools (F12) para ver responsive design
4. Anota qué elementos necesitan refinamiento

#### **Si eres developer:**
1. Abre un archivo HTML
2. Revisa la estructura (HTML/CSS/JS)
3. Nota los patrones de componentes reutilizables
4. Identifica oportunidades de abstracción

---

## 📁 Estructura de Archivos

```
docs/prototipo-html/
├── README.md                    ← Este archivo
├── index.html                   ← Hub principal (inicio)
├── styles.css                   ← Estilos compartidos (reutilizable)
├── padre.html                   ← Perfil Padre/Tutor
├── docente.html                 ← Perfil Docente
├── admin.html                   ← Perfil Administrador
├── alumno-inicial.html          ← Perfil Alumno Inicial (3-5 años)
├── alumno-primaria.html         ← Perfil Alumno Primaria (6-12 años)
└── alumno-secundaria.html       ← Perfil Alumno Secundaria (13-17 años)
```

### Notas de Implementación

- ✅ **CSS Compartido:** `styles.css` contiene todos los estilos base (colores, componentes, responsive)
- ✅ **JavaScript Mínimo:** Solo lógica de interacción (tabs, modales, simulaciones)
- ✅ **Sin Backend:** Todos los datos son estáticos (hardcoded en el HTML)
- ✅ **Exportable:** Puedes descargar la carpeta completa y abrirla offline

---

## 🎮 Funcionalidades Interactivas

### Chat Conversacional (Padre)

```
Usuario: "¿Cómo le fue a Mateo esta semana?"
           ↓
Asistente: [Resumen académico simulado]
           + Quick chips: [Resumen] [Ausencia] [Pagos] [Agenda]
           ↓
Usuario: "Mateo no va a ir mañana"
         ↓
Sistema: [Confirma detalles] → [Registra ausencia]
```

### Simulador Financiero (Admin)

- Sliders interactivos para variar parámetros
- Cálculo dinámico de impacto financiero
- Recomendaciones basadas en simulación

### Tabelas de Datos (Docente)

- Inputs editables para calificaciones
- Alertas de cambios significativos
- Confirmación de acciones críticas

### Gamificación (Alumnos)

- Animaciones de éxito (aplausos, confeti)
- Progreso visual (barras, círculos)
- Notificaciones de logros

---

## 🎨 Consideraciones de Diseño

### Paleta de Colores

- **Primario:** `#4F46E5` (Indigo, CTA principal)
- **Secundario:** `#667eea` / `#764ba2` (Gradientes)
- **Éxito:** `#10b981` (Verde)
- **Alerta:** `#ef4444` (Rojo)
- **Warning:** `#f59e0b` (Ámbar)

### Tipografía

- **Familia:** System fonts (-apple-system, Segoe UI, sans-serif)
- **Heading:** Bold, 24-28px (h1), 18-20px (h2), 14-16px (h3)
- **Body:** Regular, 14px
- **Caption:** 12px, #999 (color)

### Componentes Reutilizables

1. **Data Card** — Información estructurada
2. **Action Card** — Llamada a acción
3. **Alert Box** — Mensajes del sistema
4. **Chat Bubble** — Mensajes conversacionales
5. **Form Group** — Inputs y labels
6. **Dashboard Card** — Métrica + label
7. **Tab Navigation** — Secciones de contenido

---

## 📝 Datos Simulados (No Son Reales)

Todos los datos mostrados son ejemplos ficticios:

- Nombres: Mateo, Sofía, Juani, Laura, María García
- Escuela: "Colegio" (genérico)
- Fechas: Marzo 2026
- Montos: Pesos argentinos ($)
- Calificaciones: Escala 1-10

---

## 🔐 Consideraciones de Seguridad (Prototipo)

✅ **Este prototipo:**
- No almacena datos
- No conecta a servicios externos
- No requiere autenticación
- Es completamente estático (HTML + CSS + JS vanilla)

⚠️ **Para producción:**
- Implementar autenticación robusta
- Encriptar datos en tránsito
- Validar inputs en servidor
- Implementar RLS (Row Level Security)
- Cumplir GDPR/normativa argentina de menores

---

## 📊 Métricas y KPIs que Demuestra el Prototipo

### Para Padres
- Asistencia: 95%
- Promedio: 8.2
- Tareas pendientes: 2
- Deuda: $4,500

### Para Docentes
- Estudiantes: 20
- Asistencia: 19 presentes
- Observaciones: 12 (Mateo)
- Actividades generadas: 3

### Para Admin
- Matrícula: 487 alumnos
- Asistencia institucional: 91%
- Deuda acumulada: $47,500
- Familias en riesgo: 23
- Recaudación proyectada: $182,400

### Para Alumnos
- Actividades completadas: 2/5 (Inicial)
- Misiones semanales: 17/20 (Primaria)
- Promedio general: 8.1 (Secundaria)

---

## 🎯 Próximos Pasos (Post-Prototipo)

1. **Validación con usuarios** — Testar con padres, docentes, admin reales
2. **Refinamiento UI/UX** — Basado en feedback
3. **Diseño de alta fidelidad** — Figma/Adobe XD
4. **Especificación técnica** — API endpoints, datos schema
5. **Development** — Next.js + Supabase + Claude API
6. **Testing** — Unit, integration, E2E
7. **Lanzamiento** — MVP a escuelas piloto

---

## 📞 Notas para Desarrolladores

### Extender el Prototipo

Si necesitas agregar más funcionalidad:

1. **Nuevo tab:** Copia el HTML de un tab existente, agrega JS para switchTab()
2. **Nuevo componente:** Define en styles.css, reutiliza clases existentes
3. **Nueva animación:** Usa @keyframes en CSS (bounce, slideIn, pulse)
4. **Chat extendido:** Expande el array `conversations` en JavaScript

### Optimizaciones Futuras

- Implementar PWA (offline capability)
- Agregar drag-and-drop para reorganizar misiones
- Voice input/output (Web Speech API)
- Dark mode (CSS variables)
- Multi-language (i18n)

---

## 📄 Licencia y Atribución

Este prototipo es parte de **Vujy** — Plataforma Educativa SaaS para escuelas privadas argentinas.

**Más información:** Ver `/docs/01-SPEC.md` para especificación completa del producto.

---

**Última actualización:** Marzo 2026
**Versión del prototipo:** 1.0
**Estado:** Listo para demostración y validación
