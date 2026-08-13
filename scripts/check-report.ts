import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const HEAVY_METAL_ELEMENTS = new Set([
  'arsenic','as','cadmium','cd','antimony','sb','tellurium','te','mercury','hg','thallium','tl','thorium','th','uranium','u','chromium','cr','lead','pb'
]);

function toPpm(value: number) {
  return Number.isFinite(value) ? value : 0;
}

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: npx ts-node scripts/check-report.ts <registrationId>');
    process.exit(1);
  }

  const registrationReport = await prisma.report.findUnique({ where: { registrationId: id }, include: { rows: true } });
  if (!registrationReport) {
    console.error('No report found for registrationId:', id);
    await prisma.$disconnect();
    process.exit(2);
  }

  console.log('Stored csvFileName for this report:', (registrationReport as any).csvFileName || '(none)');

  const rawPayload = (registrationReport as any).rawPayload as Record<string, unknown> | null;
  const detectionLimits: Record<string, number> = (rawPayload && typeof rawPayload === 'object' && (rawPayload as any).detectionLimits)
    ? (rawPayload as any).detectionLimits
    : {};

  const mergedRows = (registrationReport.rows || []).map((r: any) => ({
    element: String(r.element || '').trim(),
    rawValue: Number(r.rawValue || 0),
    ppmValue: Number(r.ppmValue || 0),
    unit: String(r.unit || 'ppm'),
    category: String(r.category || '').trim().toLowerCase(),
    detectionLimitPercent: detectionLimits[String(r.element || '').trim().toLowerCase()] ?? undefined,
  }));

  function detectionLimitPpmFor(row: any) {
    const dl = row.detectionLimitPercent;
    return dl != null && Number.isFinite(dl) ? dl * 10000 : null;
  }

  function isDetected(row: any) {
    if (!(toPpm(row.ppmValue) > 0)) return false;
    const dl = detectionLimitPpmFor(row);
    if (dl != null && row.ppmValue < dl) return false;
    return true;
  }

  const detected = mergedRows.filter(isDetected);
  const notDetected = mergedRows.filter((r) => !isDetected(r));

  const heavyMetals = detected.filter((r) => {
    const key = String(r.element || '').trim().toLowerCase();
    return HEAVY_METAL_ELEMENTS.has(key) || HEAVY_METAL_ELEMENTS.has(key.replace(/[^a-z]/g, ''));
  });

  console.log('Report registrationId:', id);
  console.log('Total rows:', mergedRows.length);
  console.log('Detected (above DL):', detected.length);
  console.log('Not detected (below DL or zero):', notDetected.length);
  console.log('\nHeavy metals (detected):');
  heavyMetals.forEach((h) => console.log('-', h.element, '| ppmValue:', h.ppmValue, '| DL ppm:', detectionLimitPpmFor(h)));

  // Chromium check
  const chrom = mergedRows.find((r) => /chromium/i.test(String(r.element || '')) || /\bcr\b/i.test(String(r.element || '')));
  if (chrom) {
    const dlPercent = chrom.detectionLimitPercent;
    const dlPpm = dlPercent != null && Number.isFinite(dlPercent) ? dlPercent * 10000 : null;
    console.log('\nChromium raw row:', chrom);
    console.log('Chromium ppmValue:', chrom.ppmValue);
    console.log('Chromium detectionLimitPercent:', dlPercent);
    console.log('Chromium detectionLimitPpm:', dlPpm);
    console.log('Chromium considered detected by logic:', isDetected(chrom));
  } else {
    console.log('\nChromium row not found in report rows.');
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try { await prisma.$disconnect(); } catch (_) {}
  process.exit(1);
});
