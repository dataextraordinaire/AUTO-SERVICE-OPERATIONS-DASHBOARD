// Sam's Auto Service Management System
// Professional-grade automotive service platform

class ServiceManagementSystem {
    constructor() {
        this.serviceOrders = [];
        this.technicians = [];
        this.parts = [];
        this.currentOrderId = 1;
        this.currentTechId = 1;
        this.currentPartId = 1;
        
        this.loadData();
        this.initializeEventListeners();
        this.renderDashboard();
        this.initializeSampleData();
    }

    // Data Management
    loadData() {
        const savedOrders = localStorage.getItem('sams_auto_orders');
        const savedTechs = localStorage.getItem('sams_auto_technicians');
        const savedParts = localStorage.getItem('sams_auto_parts');
        
        if (savedOrders) this.serviceOrders = JSON.parse(savedOrders);
        if (savedTechs) this.technicians = JSON.parse(savedTechs);
        if (savedParts) this.parts = JSON.parse(savedParts);
        
        // Set next IDs
        this.currentOrderId = Math.max(...this.serviceOrders.map(o => o.id), 0) + 1;
        this.currentTechId = Math.max(...this.technicians.map(t => t.id), 0) + 1;
        this.currentPartId = Math.max(...this.parts.map(p => p.id), 0) + 1;
    }

    saveData() {
        localStorage.setItem('sams_auto_orders', JSON.stringify(this.serviceOrders));
        localStorage.setItem('sams_auto_technicians', JSON.stringify(this.technicians));
        localStorage.setItem('sams_auto_parts', JSON.stringify(this.parts));
    }

    initializeSampleData() {
        if (this.technicians.length === 0) {
            this.technicians = [
                {
                    id: 1,
                    name: "Mike Chen",
                    specialization: "autonomous",
                    status: "available",
                    contact: "mike.chen@samsauto.com",
                    currentAssignment: null,
                    completionRate: 95
                },
                {
                    id: 2,
                    name: "Sarah Johnson",
                    specialization: "electrical",
                    status: "busy",
                    contact: "sarah.johnson@samsauto.com",
                    currentAssignment: "SO-001",
                    completionRate: 92
                },
                {
                    id: 3,
                    name: "Alex Rodriguez",
                    specialization: "engine",
                    status: "available",
                    contact: "alex.rodriguez@samsauto.com",
                    currentAssignment: null,
                    completionRate: 88
                },
                {
                    id: 4,
                    name: "Emma Wilson",
                    specialization: "diagnostics",
                    status: "available",
                    contact: "emma.wilson@samsauto.com",
                    currentAssignment: null,
                    completionRate: 97
                }
            ];
            this.currentTechId = 5;
        }

        if (this.parts.length === 0) {
            this.parts = [
                {
                    id: 1,
                    partNumber: "BRK-001",
                    name: "Brake Pads - High Performance",
                    category: "brakes",
                    currentStock: 25,
                    minStock: 10,
                    unitCost: 85.99,
                    supplier: "AutoParts Pro",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 2,
                    partNumber: "SEN-045",
                    name: "LiDAR Sensor Module",
                    category: "sensors",
                    currentStock: 5,
                    minStock: 8,
                    unitCost: 1250.00,
                    supplier: "TechSensors Inc",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 3,
                    partNumber: "ENG-220",
                    name: "Engine Oil Filter",
                    category: "engine",
                    currentStock: 45,
                    minStock: 15,
                    unitCost: 24.99,
                    supplier: "AutoParts Pro",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 4,
                    partNumber: "ELE-089",
                    name: "Battery Management System",
                    category: "electrical",
                    currentStock: 3,
                    minStock: 5,
                    unitCost: 850.00,
                    supplier: "ElectricAuto Supply",
                    lastUpdated: new Date().toISOString()
                }
            ];
            this.currentPartId = 5;
        }

        if (this.serviceOrders.length === 0) {
            this.serviceOrders = [
                {
                    id: 1,
                    orderId: "SO-001",
                    dateCreated: new Date().toISOString(),
                    vehicle: "AV-001 (2024 Tesla Model S)",
                    customer: "John Smith",
                    serviceType: "diagnostic",
                    status: "in-progress",
                    priority: "high",
                    technician: "Sarah Johnson",
                    estimatedCost: 450.00,
                    description: "Autonomous driving system calibration and diagnostics"
                },
                {
                    id: 2,
                    orderId: "SO-002",
                    dateCreated: new Date(Date.now() - 86400000).toISOString(),
                    vehicle: "AV-003 (2024 BMW iX)",
                    customer: "Maria Garcia",
                    serviceType: "routine-maintenance",
                    status: "pending",
                    priority: "medium",
                    technician: "Mike Chen",
                    estimatedCost: 275.00,
                    description: "Scheduled 10K mile service and sensor cleaning"
                },
                {
                    id: 3,
                    orderId: "SO-003",
                    dateCreated: new Date(Date.now() - 172800000).toISOString(),
                    vehicle: "AV-007 (2024 Ford Mustang Mach-E)",
                    customer: "David Wilson",
                    serviceType: "repair",
                    status: "completed",
                    priority: "low",
                    technician: "Alex Rodriguez",
                    estimatedCost: 850.00,
                    description: "Battery cooling system repair and replacement"
                }
            ];
            this.currentOrderId = 4;
        }

        this.saveData();
    }

    // Event Listeners
    initializeEventListeners() {
        // Search functionality
        const ordersSearch = document.getElementById('orders-search');
        if (ordersSearch) {
            ordersSearch.addEventListener('input', () => this.filterOrders());
        }

        const techsSearch = document.getElementById('techs-search');
        if (techsSearch) {
            techsSearch.addEventListener('input', () => this.filterTechnicians());
        }

        const partsSearch = document.getElementById('parts-search');
        if (partsSearch) {
            partsSearch.addEventListener('input', () => this.filterParts());
        }

        // Filter functionality
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterOrders());
        }

        const availabilityFilter = document.getElementById('availability-filter');
        if (availabilityFilter) {
            availabilityFilter.addEventListener('change', () => this.filterTechnicians());
        }

        const stockFilter = document.getElementById('stock-filter');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => this.filterParts());
        }

        // Form submissions
        const serviceOrderForm = document.getElementById('service-order-form');
        if (serviceOrderForm) {
            serviceOrderForm.addEventListener('submit', (e) => this.handleServiceOrderSubmit(e));
        }

        const technicianForm = document.getElementById('technician-form');
        if (technicianForm) {
            technicianForm.addEventListener('submit', (e) => this.handleTechnicianSubmit(e));
        }

        const partForm = document.getElementById('part-form');
        if (partForm) {
            partForm.addEventListener('submit', (e) => this.handlePartSubmit(e));
        }
    }

    // Navigation
    showSection(section, button) {
        // Close any open modals first
        this.closeAllModals();
        
        // Hide all sections
        const sections = ['dashboard', 'service-orders', 'technicians', 'parts', 'analytics'];
        sections.forEach(sec => {
            const element = document.getElementById(sec);
            if (element) element.classList.add('hidden');
        });

        // Remove active class from all buttons
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(section);
        if (targetSection) targetSection.classList.remove('hidden');

        // Add active class to clicked button
        if (button) button.classList.add('active');

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'service-orders': 'Service Orders',
            'technicians': 'Technicians',
            'parts': 'Parts Inventory',
            'analytics': 'Analytics'
        };
        
        const titleElement = document.getElementById('page-title');
        if (titleElement) titleElement.textContent = titles[section] || 'Dashboard';

        // Render content for the selected section
        switch (section) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'service-orders':
                this.renderServiceOrders();
                break;
            case 'technicians':
                this.renderTechnicians();
                break;
            case 'parts':
                this.renderParts();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
        }
    }

    // Dashboard Rendering
    renderDashboard() {
        this.updateMetrics();
        this.renderRecentOrders();
    }

    updateMetrics() {
        const activeOrders = this.serviceOrders.filter(order => 
            order.status === 'pending' || order.status === 'in-progress'
        ).length;
        
        const availableTechs = this.technicians.filter(tech => 
            tech.status === 'available'
        ).length;
        
        const vehiclesInService = this.serviceOrders.filter(order => 
            order.status === 'in-progress'
        ).length;
        
        const lowStockParts = this.parts.filter(part => 
            part.currentStock <= part.minStock
        ).length;

        // Update metric displays
        const activeOrdersElement = document.getElementById('active-orders-count');
        const availableTechsElement = document.getElementById('available-techs-count');
        const vehiclesElement = document.getElementById('vehicles-count');
        const lowStockElement = document.getElementById('low-stock-count');

        if (activeOrdersElement) activeOrdersElement.textContent = activeOrders;
        if (availableTechsElement) availableTechsElement.textContent = availableTechs;
        if (vehiclesElement) vehiclesElement.textContent = vehiclesInService;
        if (lowStockElement) lowStockElement.textContent = lowStockParts;
    }

    renderRecentOrders() {
        const tableBody = document.getElementById('recent-orders-table');
        if (!tableBody) return;

        const recentOrders = this.serviceOrders
            .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
            .slice(0, 5);

        tableBody.innerHTML = recentOrders.map(order => `
            <tr>
                <td><strong>${order.orderId}</strong></td>
                <td>${order.vehicle}</td>
                <td>${order.customer}</td>
                <td><span class="status-badge status-${order.status.replace('-', '')}">${order.status.replace('-', ' ')}</span></td>
                <td><span class="priority-badge priority-${order.priority}">${order.priority}</span></td>
                <td>${order.technician}</td>
                <td>
                    <button class="btn btn-secondary" onclick="serviceManager.viewOrder(${order.id})">View</button>
                    <button class="btn btn-primary" onclick="serviceManager.editOrder(${order.id})">Edit</button>
                </td>
            </tr>
        `).join('');
    }

    // Service Orders
    renderServiceOrders() {
        const tableBody = document.getElementById('all-orders-table');
        const ordersCount = document.getElementById('orders-count');
        
        if (!tableBody) return;

        const filteredOrders = this.getFilteredOrders();
        
        if (ordersCount) {
            ordersCount.textContent = `${filteredOrders.length} orders`;
        }

        tableBody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td><strong>${order.orderId}</strong></td>
                <td>${new Date(order.dateCreated).toLocaleDateString()}</td>
                <td>${order.vehicle}</td>
                <td>${order.customer}</td>
                <td>${order.serviceType.replace('-', ' ')}</td>
                <td><span class="status-badge status-${order.status.replace('-', '')}">${order.status.replace('-', ' ')}</span></td>
                <td><span class="priority-badge priority-${order.priority}">${order.priority}</span></td>
                <td>${order.technician}</td>
                <td>$${order.estimatedCost.toFixed(2)}</td>
                <td>
                    <button class="btn btn-secondary" onclick="serviceManager.viewOrder(${order.id})">View</button>
                    <button class="btn btn-primary" onclick="serviceManager.editOrder(${order.id})">Edit</button>
                </td>
            </tr>
        `).join('');

        this.populateTechnicianSelect();
    }

    getFilteredOrders() {
        const searchTerm = document.getElementById('orders-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('status-filter')?.value || '';

        return this.serviceOrders.filter(order => {
            const matchesSearch = order.orderId.toLowerCase().includes(searchTerm) ||
                                order.customer.toLowerCase().includes(searchTerm) ||
                                order.vehicle.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }

    filterOrders() {
        this.renderServiceOrders();
    }

    // Technicians
    renderTechnicians() {
        const tableBody = document.getElementById('technicians-table');
        const techsCount = document.getElementById('techs-count');
        
        if (!tableBody) return;

        const filteredTechs = this.getFilteredTechnicians();
        
        if (techsCount) {
            techsCount.textContent = `${filteredTechs.length} technicians`;
        }

        tableBody.innerHTML = filteredTechs.map(tech => `
            <tr>
                <td><strong>T-${String(tech.id).padStart(3, '0')}</strong></td>
                <td>${tech.name}</td>
                <td>${tech.specialization.replace('-', ' ')}</td>
                <td><span class="status-badge status-${tech.status.replace('-', '')}">${tech.status.replace('-', ' ')}</span></td>
                <td>${tech.currentAssignment || 'None'}</td>
                <td>${tech.completionRate}%</td>
                <td>${tech.contact}</td>
                <td>
                    <button class="btn btn-secondary" onclick="serviceManager.viewTechnician(${tech.id})">View</button>
                    <button class="btn btn-primary" onclick="serviceManager.editTechnician(${tech.id})">Edit</button>
                </td>
            </tr>
        `).join('');
    }

    getFilteredTechnicians() {
        const searchTerm = document.getElementById('techs-search')?.value.toLowerCase() || '';
        const availabilityFilter = document.getElementById('availability-filter')?.value || '';

        return this.technicians.filter(tech => {
            const matchesSearch = tech.name.toLowerCase().includes(searchTerm) ||
                                tech.specialization.toLowerCase().includes(searchTerm);
            
            const matchesAvailability = !availabilityFilter || tech.status === availabilityFilter;
            
            return matchesSearch && matchesAvailability;
        });
    }

    filterTechnicians() {
        this.renderTechnicians();
    }

    // Parts
    renderParts() {
        const tableBody = document.getElementById('parts-table');
        const partsCount = document.getElementById('parts-count');
        
        if (!tableBody) return;

        const filteredParts = this.getFilteredParts();
        
        if (partsCount) {
            partsCount.textContent = `${filteredParts.length} parts`;
        }

        tableBody.innerHTML = filteredParts.map(part => {
            const stockStatus = part.currentStock <= part.minStock ? 'low-stock' : 'in-stock';
            const stockClass = stockStatus === 'low-stock' ? 'priority-high' : 'status-completed';
            
            return `
                <tr>
                    <td><strong>${part.partNumber}</strong></td>
                    <td>${part.name}</td>
                    <td>${part.category.replace('-', ' ')}</td>
                    <td><span class="status-badge ${stockClass}">${part.currentStock}</span></td>
                    <td>${part.minStock}</td>
                    <td>$${part.unitCost.toFixed(2)}</td>
                    <td>${part.supplier}</td>
                    <td>${new Date(part.lastUpdated).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="serviceManager.viewPart(${part.id})">View</button>
                        <button class="btn btn-primary" onclick="serviceManager.editPart(${part.id})">Edit</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getFilteredParts() {
        const searchTerm = document.getElementById('parts-search')?.value.toLowerCase() || '';
        const stockFilter = document.getElementById('stock-filter')?.value || '';

        return this.parts.filter(part => {
            const matchesSearch = part.name.toLowerCase().includes(searchTerm) ||
                                part.partNumber.toLowerCase().includes(searchTerm) ||
                                part.category.toLowerCase().includes(searchTerm);
            
            let matchesStock = true;
            if (stockFilter === 'low-stock') {
                matchesStock = part.currentStock <= part.minStock;
            } else if (stockFilter === 'in-stock') {
                matchesStock = part.currentStock > part.minStock;
            } else if (stockFilter === 'out-of-stock') {
                matchesStock = part.currentStock === 0;
            }
            
            return matchesSearch && matchesStock;
        });
    }

    filterParts() {
        this.renderParts();
    }

    // Analytics
    renderAnalytics() {
        const totalOrders = this.serviceOrders.length;
        const completedOrders = this.serviceOrders.filter(order => order.status === 'completed').length;
        const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
        
        const avgServiceTime = 24; // Mock data for now
        const monthlyRevenue = this.serviceOrders
            .filter(order => order.status === 'completed')
            .reduce((sum, order) => sum + order.estimatedCost, 0);
        
        const customerSatisfaction = 94; // Mock data
        const partsUsed = this.parts.reduce((sum, part) => sum + (100 - part.currentStock), 0); // Mock calculation

        // Update analytics displays
        document.getElementById('total-orders-stat').textContent = totalOrders;
        document.getElementById('completion-rate-stat').textContent = `${completionRate}%`;
        document.getElementById('avg-time-stat').textContent = `${avgServiceTime}h`;
        document.getElementById('revenue-stat').textContent = `$${monthlyRevenue.toLocaleString()}`;
        document.getElementById('customer-satisfaction-stat').textContent = `${customerSatisfaction}%`;
        document.getElementById('parts-used-stat').textContent = partsUsed;
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Add click outside to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modalId);
                }
            });
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    }

    // Close all modals
    closeAllModals() {
        const modals = ['service-order-modal', 'technician-modal', 'part-modal'];
        modals.forEach(modalId => this.closeModal(modalId));
    }

    // Form Handlers
    handleServiceOrderSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newOrder = {
            id: this.currentOrderId++,
            orderId: `SO-${String(this.currentOrderId - 1).padStart(3, '0')}`,
            dateCreated: new Date().toISOString(),
            vehicle: formData.get('vehicle'),
            customer: formData.get('customer'),
            serviceType: formData.get('serviceType'),
            status: 'pending',
            priority: formData.get('priority'),
            technician: formData.get('technician'),
            estimatedCost: parseFloat(formData.get('estimatedCost')),
            description: formData.get('description')
        };

        this.serviceOrders.push(newOrder);
        this.saveData();
        this.closeModal('service-order-modal');
        this.renderDashboard();
        this.renderServiceOrders();
        
        alert('Service order created successfully!');
    }

    handleTechnicianSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newTechnician = {
            id: this.currentTechId++,
            name: formData.get('name'),
            specialization: formData.get('specialization'),
            status: 'available',
            contact: formData.get('contact'),
            currentAssignment: null,
            completionRate: 85 + Math.floor(Math.random() * 15) // Random between 85-100
        };

        this.technicians.push(newTechnician);
        this.saveData();
        this.closeModal('technician-modal');
        this.renderTechnicians();
        
        alert('Technician added successfully!');
    }

    handlePartSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newPart = {
            id: this.currentPartId++,
            partNumber: formData.get('partNumber'),
            name: formData.get('name'),
            category: formData.get('category'),
            currentStock: parseInt(formData.get('currentStock')),
            minStock: parseInt(formData.get('minStock')),
            unitCost: parseFloat(formData.get('unitCost')),
            supplier: formData.get('supplier'),
            lastUpdated: new Date().toISOString()
        };

        this.parts.push(newPart);
        this.saveData();
        this.closeModal('part-modal');
        this.renderParts();
        
        alert('Part added successfully!');
    }

    populateTechnicianSelect() {
        const select = document.getElementById('technician-select');
        if (!select) return;

        const availableTechs = this.technicians.filter(tech => tech.status === 'available');
        
        select.innerHTML = '<option value="">Select Technician</option>' +
            availableTechs.map(tech => 
                `<option value="${tech.name}">${tech.name} (${tech.specialization})</option>`
            ).join('');
    }

    // Action Methods
    viewOrder(id) {
        const order = this.serviceOrders.find(o => o.id === id);
        if (order) {
            alert(`Order Details:\n\nOrder ID: ${order.orderId}\nCustomer: ${order.customer}\nVehicle: ${order.vehicle}\nService: ${order.serviceType}\nStatus: ${order.status}\nTechnician: ${order.technician}\nCost: $${order.estimatedCost}\n\nDescription: ${order.description}`);
        }
    }

    editOrder(id) {
        alert('Edit functionality would open a detailed edit form for this order.');
    }

    viewTechnician(id) {
        const tech = this.technicians.find(t => t.id === id);
        if (tech) {
            alert(`Technician Details:\n\nName: ${tech.name}\nSpecialization: ${tech.specialization}\nStatus: ${tech.status}\nContact: ${tech.contact}\nCompletion Rate: ${tech.completionRate}%\nCurrent Assignment: ${tech.currentAssignment || 'None'}`);
        }
    }

    editTechnician(id) {
        alert('Edit functionality would open a detailed edit form for this technician.');
    }

    viewPart(id) {
        const part = this.parts.find(p => p.id === id);
        if (part) {
            alert(`Part Details:\n\nPart Number: ${part.partNumber}\nName: ${part.name}\nCategory: ${part.category}\nCurrent Stock: ${part.currentStock}\nMinimum Stock: ${part.minStock}\nUnit Cost: $${part.unitCost}\nSupplier: ${part.supplier}`);
        }
    }

    editPart(id) {
        alert('Edit functionality would open a detailed edit form for this part.');
    }
}

// Global Functions
function showSection(section, button) {
    serviceManager.showSection(section, button);
}

function openServiceOrderModal() {
    serviceManager.populateTechnicianSelect();
    serviceManager.openModal('service-order-modal');
}

function openTechnicianModal() {
    serviceManager.openModal('technician-modal');
}

function openPartModal() {
    serviceManager.openModal('part-modal');
}

function closeModal(modalId) {
    serviceManager.closeModal(modalId);
}

// Global escape key handler
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (serviceManager) {
            serviceManager.closeAllModals();
        }
    }
});

// Initialize the application
let serviceManager;
document.addEventListener('DOMContentLoaded', function() {
    serviceManager = new ServiceManagementSystem();
    
    // Close any modals if clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            serviceManager.closeAllModals();
        }
    });
});