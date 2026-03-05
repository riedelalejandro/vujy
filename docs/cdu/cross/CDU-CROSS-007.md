# CDU-CROSS-007 — Modo corresponsal en eventos escolares

← [Volver al índice](../README.md)

---

## CDU-CROSS-007 — Modo corresponsal en eventos escolares

**Prioridad:** P2 | **Origen:** `[Innovation]` · 🎲 Apuesta 10% (ver [decisor](../../12-CDU-DECISOR-90-10.md))
**Actor:** Docente designado como corresponsal (emisor) · Padres/Tutores (receptores)
**Canales:** App (corresponsal) · App · WhatsApp · Push (familias)
**Tier:** Premium
**Gate:** Solo se activa en producción si CDU-ADM-015 y CDU-CROSS-005 están implementados y el flag `foto_bloqueada` existe en el modelo de datos.

**Trigger:** El admin activa "Modo Acto" para un evento del calendario escolar. Desde ese momento, el docente corresponsal puede publicar updates en tiempo real desde una pantalla ultra-simple.

**Flujo conversacional:**
```
[Admin — mañana del acto de fin de año]

Admin: "Activá el modo acto para el acto de hoy"

Asistente: [llama activar_modo_acto(escuela_id, evento_id="acto_fin_año_2026")]
→ "Modo Acto activado para 'Acto de Fin de Año 2026'.
   Corresponsal asignado: Seño Claudia Méndez (3ro B).
   Familias notificadas: 'El acto comienza. Seguilo en vivo en la app.'
   ¿Empezamos?"

---

[Docente corresponsal — pantalla simplificada durante el acto]

[Pantalla muestra solo: campo de texto corto + botón de foto + campo "¿Quién protagonizó este momento?" (opcional)]

Seño Claudia: [sube foto] [escribe "Mati terminó su discurso"] [selecciona "Mati López" del selector]

App: [muestra warning: "Mati López tiene opt-in de fotos activo ✅"]
     [botón "Publicar"]

Seño Claudia: [toca "Publicar"]

Asistente: [llama publicar_update_evento(evento_id, texto, foto, alumno_id="mati_lopez")]
           [valida flag foto_bloqueada → ok]
           [envía mención personalizada a familia López + update general al resto]

[Familia López recibe en la app]
→ "🎤 Mati terminó su discurso — hace 30 segundos
   [foto]"

[Resto de familias recibe]
→ "🎭 Acto en vivo — Mati López terminó su discurso
   [foto sin mención individual en el texto de la push]"

---

[Al finalizar el acto]

Asistente: [llama generar_album_evento(evento_id)]
→ [Admin recibe notificación]
   "El álbum del Acto de Fin de Año está listo (23 fotos, 8 updates).
   Quedó guardado en el perfil de cada alumno que fue mencionado.
   ¿Lo compartimos con todas las familias?"

Admin: "Sí"

Asistente: → "Álbum publicado. Las familias pueden verlo en el perfil de su hijo."
```

**Tool MCP requerida:**
- `activar_modo_acto` (habilita la pantalla simplificada del corresponsal + notifica familias)
- `publicar_update_evento` (valida `foto_bloqueada` antes de publicar — bloqueo si el flag está activo)
- `generar_album_evento` (cronología automática de fotos y updates al finalizar)

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Alumno con `foto_bloqueada=true` en el selector | El nombre aparece en rojo con "⚠️ Sin permiso de imagen" — el corresponsal puede publicar el update sin la foto o sin la mención |
| Foto grupal con alumno sin opt-in en primer plano | Warning: "Hay alumnos sin opt-in de imagen en esta foto. ¿Querés continuar sin mencionarlos o cambiar la foto?" |
| Sin conexión durante el acto | Modo offline: las publicaciones se guardan en el dispositivo y se sincronizan al reconectar — aparecen con timestamp original |
| Evento cancelado después de activar el modo | Notificación masiva automática a todas las familias (CDU-CROSS-002) |
| Admin quiere eliminar una foto publicada por error | Ventana de eliminación de 24 hs desde la publicación — el admin puede retirar el update |
| Corresponsal publica un update inapropiado | Admin puede moderar y retirar desde el panel — el corresponsal recibe aviso |
| Múltiples actos simultáneos | Cada acto tiene su propio hilo — los corresponsales operan de forma independiente |

**Razonamiento de la apuesta 10%:**
Este CDU tiene el mayor potencial viral del catálogo. Una familia que recibe en tiempo real el momento en que su hijo dio su primer discurso escolar lo comparte en grupos de WhatsApp de otros padres. El riesgo de privacidad es real pero técnicamente mitigable: el flag `foto_bloqueada` + el warning antes de publicar + la ventana de corrección de 24 hs hacen que Vujy sea estrictamente más seguro que el grupo de WhatsApp del grado donde esto ocurre hoy sin ningún control. Sin Vujy, ese momento pasa igual — sin privacidad.

**Principio VI (cero fricción):** La pantalla del corresponsal tiene exactamente 3 elementos: campo de texto corto, botón de cámara, selector de alumno (opcional). Sin menús, sin configuración, sin distracción. Si el corresponsal necesita más de 10 segundos para publicar un update, el diseño falló.
