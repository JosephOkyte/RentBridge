// Seed and Fallback Data for RentBridge Seeker Requests (The Wanted Matchboard)

export const SEED_REQUESTS = [
  {
    id: 'req-1',
    ticketId: 'REQ-LK-84920',
    seekerName: 'Chinedu Okafor',
    seekerPhone: '+234 803 555 1290',
    seekerPhoneMasked: '+234 803 ••• 1290',
    seekerEmail: 'chinedu.okafor@techcorp.ng',
    city: 'lagos',
    cityName: 'Lagos',
    preferredLocations: ['Lekki Phase 1', 'Admiralty Way', 'Ikate Elegushi'],
    propertyType: '2_bed_apartment',
    propertyTypeLabel: '2-Bedroom Serviced Apartment',
    minBudget: 4500000,
    maxBudget: 6000000,
    moveInTimeline: 'within_14_days',
    moveInTimelineLabel: 'Within 14 Days (Ready to Pay)',
    mustHaves: [
      'Flood-Free Access Road',
      'Dedicated Smart Prepaid Metre',
      'Central Estate Gen (12h-24h)',
      'Gated Estate Security Gate'
    ],
    seekerBio: 'Senior Mobile Engineer at a fintech in Victoria Island. Solo occupant, looking for quiet compound with reliable power and no middleman wahala.',
    status: 'active',
    proposalsCount: 2,
    createdAt: '2026-11-12T08:30:00Z'
  },
  {
    id: 'req-2',
    ticketId: 'REQ-ABJ-31940',
    seekerName: 'Amina Bello, Esq.',
    seekerPhone: '+234 802 777 4831',
    seekerPhoneMasked: '+234 802 ••• 4831',
    seekerEmail: 'amina.bello@lawfirm.ng',
    city: 'abuja',
    cityName: 'Abuja',
    preferredLocations: ['Wuse 2', 'Maitama Axis', 'Gwarinpa Estate'],
    propertyType: '3_bed_duplex',
    propertyTypeLabel: '3-Bedroom Terrace / Duplex',
    minBudget: 8000000,
    maxBudget: 12000000,
    moveInTimeline: 'next_month',
    moveInTimelineLabel: 'Next Month (December 2026)',
    mustHaves: [
      'Dedicated Transformer (Band A)',
      'Industrial Borehole Water Plant',
      'Dedicated Compound Parking (2+ Cars)',
      'Direct Landlord / SAN Custody Only'
    ],
    seekerBio: 'Corporate legal practitioner moving with family of 3. Prefer direct SAN lawyer or owner custody with ₦0 roadside agent fee.',
    status: 'active',
    proposalsCount: 3,
    createdAt: '2026-11-11T14:15:00Z'
  },
  {
    id: 'req-3',
    ticketId: 'REQ-PH-59281',
    seekerName: 'Engr. Tariye Briggs',
    seekerPhone: '+234 809 112 3948',
    seekerPhoneMasked: '+234 809 ••• 3948',
    seekerEmail: 'tariye.briggs@offshorenergy.com',
    city: 'ph',
    cityName: 'Port Harcourt',
    preferredLocations: ['Old GRA', 'GRA Phase 2', 'Peter Odili Road'],
    propertyType: '3_bed_apartment',
    propertyTypeLabel: '3-Bedroom Luxury Apartment',
    minBudget: 5000000,
    maxBudget: 7500000,
    moveInTimeline: 'immediate',
    moveInTimelineLabel: 'Immediate (Within 7 Days)',
    mustHaves: [
      'Uniformed Perimeter Security',
      'Flood-Free Interlocked Compound',
      'Inverter / Solar System in Place',
      'Prepaid Smart Metre'
    ],
    seekerBio: 'Subsea engineer on 28/28 rotation. Need a fully secure flat in GRA with reliable caretaker and compound gate pass access.',
    status: 'active',
    proposalsCount: 1,
    createdAt: '2026-11-10T11:00:00Z'
  },
  {
    id: 'req-4',
    ticketId: 'REQ-ENU-10492',
    seekerName: 'Dr. Obinna Nnamani',
    seekerPhone: '+234 806 334 9182',
    seekerPhoneMasked: '+234 806 ••• 9182',
    seekerEmail: 'obinna.nnamani@unth.edu.ng',
    city: 'enugu',
    cityName: 'Enugu',
    preferredLocations: ['Independence Layout', 'New Haven', 'Golf Estate'],
    propertyType: '2_bed_apartment',
    propertyTypeLabel: '2-Bedroom Modern Flat',
    minBudget: 2200000,
    maxBudget: 3500000,
    moveInTimeline: 'flexible',
    moveInTimelineLabel: 'Flexible (Inspection Ready)',
    mustHaves: [
      'Constant Clean Water Supply',
      'Fenced Compound with Gate Man',
      'Individual Prepaid Metre',
      'Tarred Access Road'
    ],
    seekerBio: 'Consultant physician at UNTH. Looking for peaceful, secure flat with verified title and zero landlord harassment.',
    status: 'active',
    proposalsCount: 1,
    createdAt: '2026-11-09T16:45:00Z'
  },
  {
    id: 'req-5',
    ticketId: 'REQ-LK-77401',
    seekerName: 'Folake Adeleke',
    seekerPhone: '+234 818 901 2244',
    seekerPhoneMasked: '+234 818 ••• 2244',
    seekerEmail: 'folake@brandstudio.ng',
    city: 'lagos',
    cityName: 'Lagos',
    preferredLocations: ['Yaba', 'Surulere', 'Ebute Metta Axis'],
    propertyType: 'mini_flat',
    propertyTypeLabel: 'Self-Contain / Mini-Flat (1 Bed)',
    minBudget: 1800000,
    maxBudget: 2500000,
    moveInTimeline: 'immediate',
    moveInTimelineLabel: 'Immediate Move-in',
    mustHaves: [
      'Prepaid Smart Metre',
      'Flood-Free Compound',
      'Gated Compound Access',
      'Zero Agent Fee / Direct Landlord'
    ],
    seekerBio: 'Creative director running a remote design boutique. Needs a secure Mainland mini-flat with fiber internet accessibility.',
    status: 'active',
    proposalsCount: 2,
    createdAt: '2026-11-12T10:15:00Z'
  }
];

// In-memory array for runtime requests added during local session
let inMemoryRequests = [...SEED_REQUESTS];

export function getInMemoryRequests() {
  return inMemoryRequests;
}

export function addInMemoryRequest(request) {
  inMemoryRequests = [request, ...inMemoryRequests];
  return request;
}

export function updateInMemoryRequestProposals(requestId) {
  inMemoryRequests = inMemoryRequests.map(r => {
    if (r.id === requestId || r.ticketId === requestId) {
      return { ...r, proposalsCount: (r.proposalsCount || 0) + 1 };
    }
    return r;
  });
}

