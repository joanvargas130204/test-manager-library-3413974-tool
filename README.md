# test-manager-library-3413974-tool

> **Prueba técnica · Ficha ADSO 3413974**  
> Sembrador de datos de demostración para Manager Library.

---

## 🚀 Uso del Sembrador

El sembrador interactúa **exclusivamente a través de la API REST** (sin tocar la base de datos directamente con SQL).

### Requisitos:
- Node.js 18+ (utiliza la API nativa de `fetch`).
- Servidor backend corriendo en `http://localhost:8000`.

### Ejecutar:
```bash
npm start
```
O directamente:
```bash
node seed.js
```

### Qué genera:
1. Autenticación como administrador (`POST /api/v1/auth/login`).
2. **40 libros** con títulos reales y autores reconocidos en las 5 categorías fijas.
3. **10 socios** con nombres y documentos de identidad colombianos válidos.
4. **15 préstamos normales** vinculando socios y libros disponibles.
5. **3 préstamos vencidos** con fecha histórica calculada de más de 14 días.
6. Verificación automática consultando `/api/v1/loans/overdue` y `/api/v1/reports/most-borrowed`.
