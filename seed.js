const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1';
const USERNAME = process.env.ADMIN_USERNAME || 'admin';
const PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPassword123!';

async function postJson(url, data, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json };
}

async function getJson(url, token = null) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${url}`, { headers });
  const json = await res.json().catch(() => null);
  return { status: res.status, data: json };
}

async function main() {
  console.log(`\n======================================================`);
  console.log(`🚀 Iniciando sembrador de demostración de Manager Library`);
  console.log(`📡 URL API: ${API_URL}`);
  console.log(`======================================================\n`);

  // 1. Login
  console.log(`1. Autenticando usuario administrador '${USERNAME}'...`);
  const loginRes = await postJson('/auth/login', { username: USERNAME, password: PASSWORD });
  if (loginRes.status !== 200 || !loginRes.data?.access_token) {
    console.error(`❌ Error de autenticación (${loginRes.status}):`, loginRes.data);
    process.exit(1);
  }
  const token = loginRes.data.access_token;
  console.log(`✅ Token obtenido con éxito. Rol: ${loginRes.data.role}`);

  // 2. Categorías
  const catRes = await getJson('/categories', token);
  if (catRes.status !== 200 || !Array.isArray(catRes.data)) {
    console.error(`❌ Error obteniendo categorías`);
    process.exit(1);
  }
  const cats = catRes.data;
  const getCatId = (name) => cats.find((c) => c.name.toLowerCase().includes(name.toLowerCase()))?.id || cats[0].id;

  // 3. Crear 40 libros
  console.log(`\n2. Sembrando 40 libros...`);
  const booksToSeed = [
    // Novela (8)
    { title: "Cien años de soledad", author: "Gabriel García Márquez", isbn: "9780307474728", cat: "Novela", copies: 5 },
    { title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", isbn: "9788420412146", cat: "Novela", copies: 4 },
    { title: "El amor en los tiempos del cólera", author: "Gabriel García Márquez", isbn: "9780307389732", cat: "Novela", copies: 4 },
    { title: "La ciudad y los perros", author: "Mario Vargas Llosa", isbn: "9788466332156", cat: "Novela", copies: 3 },
    { title: "Rayuela", author: "Julio Cortázar", isbn: "9788420437484", cat: "Novela", copies: 4 },
    { title: "Ficciones", author: "Jorge Luis Borges", isbn: "9788497598835", cat: "Novela", copies: 4 },
    { title: "Pedro Páramo", author: "Juan Rulfo", isbn: "9788437604183", cat: "Novela", copies: 3 },
    { title: "Crimen y castigo", author: "Fiódor Dostoyevski", isbn: "9788420651347", cat: "Novela", copies: 4 },

    // Ciencia (8)
    { title: "Cosmos", author: "Carl Sagan", isbn: "9788408053958", cat: "Ciencia", copies: 4 },
    { title: "Breve historia del tiempo", author: "Stephen Hawking", isbn: "9788498927948", cat: "Ciencia", copies: 4 },
    { title: "El gen egoísta", author: "Richard Dawkins", isbn: "9788434501782", cat: "Ciencia", copies: 3 },
    { title: "El origen de las especies", author: "Charles Darwin", isbn: "9788497940176", cat: "Ciencia", copies: 4 },
    { title: "Una breve historia de casi todo", author: "Bill Bryson", isbn: "9788478888764", cat: "Ciencia", copies: 4 },
    { title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", isbn: "9780393609394", cat: "Ciencia", copies: 3 },
    { title: "El universo elegante", author: "Brian Greene", isbn: "9788498921236", cat: "Ciencia", copies: 3 },
    { title: "Siete breves lecciones de física", author: "Carlo Rovelli", isbn: "9788433963925", cat: "Ciencia", copies: 3 },

    // Tecnología (8)
    { title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", cat: "Tecnología", copies: 5 },
    { title: "The Pragmatic Programmer", author: "David Thomas, Andrew Hunt", isbn: "9780135957059", cat: "Tecnología", copies: 5 },
    { title: "Design Patterns: Elements of Reusable Object-Oriented Software", author: "Erich Gamma et al.", isbn: "9780201633610", cat: "Tecnología", copies: 4 },
    { title: "Refactoring", author: "Martin Fowler", isbn: "9780134757599", cat: "Tecnología", copies: 4 },
    { title: "Domain-Driven Design", author: "Eric Evans", isbn: "9780321125217", cat: "Tecnología", copies: 4 },
    { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781449373320", cat: "Tecnología", copies: 4 },
    { title: "Building Microservices", author: "Sam Newman", isbn: "9781492034025", cat: "Tecnología", copies: 3 },
    { title: "Introduction to Algorithms", author: "Thomas H. Cormen et al.", isbn: "9780262046305", cat: "Tecnología", copies: 4 },

    // Historia (8)
    { title: "Sapiens: De animales a dioses", author: "Yuval Noah Harari", isbn: "9788499924212", cat: "Historia", copies: 5 },
    { title: "Homo Deus: Breve historia del mañana", author: "Yuval Noah Harari", isbn: "9788499926711", cat: "Historia", copies: 4 },
    { title: "Armas, gérmenes y acero", author: "Jared Diamond", isbn: "9788499921440", cat: "Historia", copies: 4 },
    { title: "El imperio otomano", author: "Jason Goodwin", isbn: "9788466318358", cat: "Historia", copies: 3 },
    { title: "La caída de Constantinopla", author: "Steven Runciman", isbn: "9788470308062", cat: "Historia", copies: 3 },
    { title: "La segunda guerra mundial", author: "Antony Beevor", isbn: "9788499245133", cat: "Historia", copies: 4 },
    { title: "Roma: La historia del imperio", author: "Mary Beard", isbn: "9788491990420", cat: "Historia", copies: 4 },
    { title: "Historia de Colombia y sus oligarquías", author: "Antonio Caballero", isbn: "9789585446298", cat: "Historia", copies: 4 },

    // Infantil (8)
    { title: "El Principito", author: "Antoine de Saint-Exupéry", isbn: "9788498418309", cat: "Infantil", copies: 5 },
    { title: "Donde viven los monstruos", author: "Maurice Sendak", isbn: "9788420430225", cat: "Infantil", copies: 4 },
    { title: "Matilda", author: "Roald Dahl", isbn: "9788420482682", cat: "Infantil", copies: 4 },
    { title: "Charlie y la fábrica de chocolate", author: "Roald Dahl", isbn: "9788420482675", cat: "Infantil", copies: 4 },
    { title: "Alicia en el país de las maravillas", author: "Lewis Carroll", isbn: "9788420650975", cat: "Infantil", copies: 4 },
    { title: "Cuentos en verso para niños perversos", author: "Roald Dahl", isbn: "9788420448909", cat: "Infantil", copies: 3 },
    { title: "Harry Potter y la piedra filosofal", author: "J.K. Rowling", isbn: "9788498382662", cat: "Infantil", copies: 5 },
    { title: "Pinocho", author: "Carlo Collodi", isbn: "9788420651231", cat: "Infantil", copies: 4 }
  ];

  const createdBooks = [];
  for (const b of booksToSeed) {
    const res = await postJson('/books', {
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      category_id: getCatId(b.cat),
      total_copies: b.copies,
    }, token);

    if (res.status === 201) {
      createdBooks.push(res.data);
    } else if (res.status === 409) {
      // Ya existía
      const getB = await getJson(`/books?q=${encodeURIComponent(b.isbn)}`, token);
      if (getB.data?.items?.[0]) createdBooks.push(getB.data.items[0]);
    }
  }
  console.log(`✅ Libros preparados: ${createdBooks.length}`);

  // 4. Crear 10 socios
  console.log(`\n3. Sembrando 10 socios...`);
  const membersToSeed = [
    { name: "Carlos Eduardo Pérez Gómez", doc: "1018456789" },
    { name: "María Alejandra Rodríguez Silva", doc: "1020789123" },
    { name: "Andrés Felipe Castro Morales", doc: "1032456781" },
    { name: "Laura Valentina Martínez Ortiz", doc: "1015678942" },
    { name: "Juan David Ramírez Herrera", doc: "1022345678" },
    { name: "Paula Andrea Torres Rincón", doc: "1030987654" },
    { name: "Santiago José Vargas Ospina", doc: "1019876543" },
    { name: "Daniela Fernanda Jiménez Ruiz", doc: "1028765432" },
    { name: "Alejandro Ruiz Benítez", doc: "1014321987" },
    { name: "Camila Sofía Mendoza Lozano", doc: "1025647382" }
  ];

  const createdMembers = [];
  for (const m of membersToSeed) {
    const res = await postJson('/members', {
      full_name: m.name,
      document_number: m.doc,
    }, token);

    if (res.status === 201) {
      createdMembers.push(res.data);
    } else if (res.status === 409) {
      const getM = await getJson(`/members?q=${encodeURIComponent(m.doc)}`, token);
      if (getM.data?.items?.[0]) createdMembers.push(getM.data.items[0]);
    }
  }
  console.log(`✅ Socios preparados: ${createdMembers.length}`);

  // 5. Crear 15 préstamos normales
  console.log(`\n4. Creando 15 préstamos regulares...`);
  let normalLoansCount = 0;
  for (let i = 0; i < 15; i++) {
    const mem = createdMembers[i % 7]; // Usar primeros 7 socios para no superar 3
    const book1 = createdBooks[i % createdBooks.length];
    const book2 = createdBooks[(i + 5) % createdBooks.length];

    const items = [{ book_id: book1.id }];
    if (i % 2 === 0 && book1.id !== book2.id) {
      items.push({ book_id: book2.id });
    }

    const res = await postJson('/loans', {
      member_id: mem.id,
      items,
    }, token);

    if (res.status === 201) {
      normalLoansCount++;
    }
  }
  console.log(`✅ Préstamos regulares registrados: ${normalLoansCount}`);

  // 6. Crear 3 préstamos vencidos
  console.log(`\n5. Creando 3 préstamos vencidos (con fecha histórica de 25 días atrás)...`);
  const pastDate = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString();
  let overdueLoansCount = 0;

  for (let i = 7; i < 10; i++) {
    const mem = createdMembers[i];
    const book = createdBooks[(i + 12) % createdBooks.length];

    const res = await postJson('/loans', {
      member_id: mem.id,
      items: [{ book_id: book.id }],
      loaned_at: pastDate,
    }, token);

    if (res.status === 201) {
      overdueLoansCount++;
    }
  }
  console.log(`✅ Préstamos vencidos generados: ${overdueLoansCount}`);

  // 7. Verificación final contra la API
  console.log(`\n6. Verificando resultados finales vía API...`);
  const overdueRes = await getJson('/loans/overdue', token);
  const overdueItemsCount = overdueRes.data?.items?.length || 0;
  console.log(`📊 Total de libros vencidos detectados por la API: ${overdueItemsCount}`);

  const reportRes = await getJson('/reports/most-borrowed?from=2026-01-01&to=2026-12-31', token);
  const reportRowsCount = reportRes.data?.rows?.length || 0;
  console.log(`📊 Filas en el reporte de más prestados: ${reportRowsCount}`);

  console.log(`\n======================================================`);
  console.log(`🎉 Sembrado completado con éxito! Listo para la feria.`);
  console.log(`======================================================\n`);
}

main().catch(console.error);
