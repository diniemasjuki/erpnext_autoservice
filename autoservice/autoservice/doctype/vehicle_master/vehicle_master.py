# Copyright (c) 2022, Hashim and contributors
# For license information, please see license.txt
# from pyvin import VIN
# vehicle = VIN ('vin_number')
# (vehicle.Make, vehicle.Model, vehicle.ModelYear)

# import frappe
from frappe.model.document import Document

class VehicleMaster(Document):

	def before_save(self):
		if self.registration_no:
			self.registration_no = self.registration_no.upper()

	def before_save(self):
		if self.vin_number:
			self.vin_number = self.vin_number.upper()
