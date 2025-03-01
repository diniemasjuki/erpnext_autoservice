# Copyright (c) 2022, Hashim and contributors
# For license information, please see license.txt
# from pyvin import VIN
# vehicle = VIN ('vin_number')
# (vehicle.Make, vehicle.Model, vehicle.ModelYear)

# import frappe
from frappe.model.document import Document

class VehicleMaster(Document):

	def validate(self):		
		if getdate(self.start_date) > getdate(self.end_date):
			frappe.throw(_("Service Contract Start Date should be less than Service Contract End Date"))
		if getdate(self.warranty_start_date) > getdate(self.warranty_end_date):
			frappe.throw(_("Service Contract Start Date should be less than Service Contract End Date"))
		
	def before_insert(self):
		if self.registration_no:
			self.registration_no = self.registration_no.replace(" ", "").upper()
		if self.engine_no:
			self.engine_no = self.engine_no.replace(" ", "").upper()
		if self.vin_number:
			self.vin_number = self.vin_number.replace(" ", "").upper()
		if self.chassis_no:
			self.chassis_no = self.chassis_no.replace(" ", "").upper()
		if self.model:
			self.model = self.model.title()

	def before_save(self):		
		if self.registration_no:
			self.registration_no = self.registration_no.replace(" ", "").upper()
		if self.engine_no:
			self.engine_no = self.engine_no.replace(" ", "").upper()
		if self.vin_number:
			self.vin_number = self.vin_number.replace(" ", "").upper()
		if self.chassis_no:
			self.chassis_no = self.chassis_no.replace(" ", "").upper()
		if self.model:
			self.model = self.model.title()
