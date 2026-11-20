import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const institution = searchParams.get('institution');
  const query = searchParams.get('q');

  let results = [...MOCK_PRODUCTS];

  if (category) {
    results = results.filter((p) => p.categoryName.toLowerCase() === category.toLowerCase());
  }

  if (institution) {
    results = results.filter((p) => p.institutionId === institution || p.institutionName.toLowerCase().includes(institution.toLowerCase()));
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q) ||
        p.isbn?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    products: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Product listed successfully with verified seller status',
      product: {
        id: `prod-${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
