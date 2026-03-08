# CDU-PAD-015 — Urgencia: alumno con incidente en la escuela

← [Volver al índice](../README.md)

---

## CDU-PAD-015 — Urgencia: alumno con incidente en la escuela

**Prioridad:** P1 | **Origen:** `[Innovation]`
**Actor:** Sistema → Padre / Tutor (iniciado por la institución)
**Canales:** Push de alta prioridad · App · WhatsApp

**Trigger:** Un adulto de la institución carga una notificación urgente sobre un incidente que involucra al hijo del padre.

**Flujo conversacional:**
```
[Push — alta prioridad — 10:35am]
"URGENTE: Notificación del Colegio San Martín sobre Mati."

Asistente: "Hola Pablo. La directora nos pidió que te contactemos urgente.
            Mati tuvo una caída en el recreo. Está con la enfermera.
            No es grave, pero tiene un golpe en el brazo derecho y la dirección
            recomienda que vengas a evaluarlo.
            ¿Podés venir al colegio?"

Padre: "Voy ahora. ¿Cuánto tarda?"

Asistente: "El colegio está a 12 minutos en auto desde tu ubicación habitual.
            ¿Le aviso a la preceptora que estás en camino?"

Padre: "Sí"

Asistente: "Gabriela fue notificada. Te esperan en la entrada principal."
```

**Tool MCP requerida:**
- `send_announcement@v1` (prioridad urgente)
- Notificación push de alta prioridad

**Casos borde:**
| Situación | Respuesta del asistente |
|-----------|------------------------|
| Padre no responde en 10 minutos | El sistema intenta al segundo tutor registrado |
| Situación médica grave | Informa que ya se llamó al servicio de emergencias; da el parte sin minimizar |
| Solo un tutor registrado y no responde | Escala a directivo para protocolo de emergencia |

**Principio III:** La información del incidente llega solo a los tutores autorizados registrados. Nunca a otros padres del grado.
