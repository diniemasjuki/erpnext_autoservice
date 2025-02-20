// Copyright (c) 2022, Hashim and contributors
// For license information, please see license.txt

frappe.ui.form.on("Work_Order", 'after_save', function(frm, cdt, cdn){
  
    var total_labor=0;
    for (var i=0 ; i < frm.doc.labor_charges.length;i++){
        total_labor = total_labor + frm.doc.labor_charges[i].gross
     } 
   cur_frm.set_value("total_labor_charge", total_labor);
   cur_frm.refresh_fields("total_labor_charge");
   console.log(total_labor)
  
  
  
    var total_parts=0;
     for (var i=0 ; i < frm.doc.parts_amount.length;i++){
         total_parts = total_parts + frm.doc.parts_amount[i].gross
      } 
    cur_frm.set_value("total_parts_charges", total_parts);
    cur_frm.refresh_fields("total_parts_charges");
    console.log(total_parts)
   
  
    var total_others=0;
     for (var i=0 ; i < frm.doc.others.length;i++){
         total_others = total_others + frm.doc.others[i].other_gross
      } 
    cur_frm.set_value("others_total", total_others);
    cur_frm.refresh_fields("others_total");
    console.log(total_others)
  
    let total = total_labor + total_parts + total_others
    let gross = total + total * (.05)
  
  console.log(total)
  frm.set_value("grand_total" , total )
  frm.set_value("gross" , gross )
  
  frappe.call({
    "method": "frappe.client.set_value" , 
    "args": {
        "doctype": "Job Sheet",
        "name": frm.doc.job_order_no,
        "fieldname": "work_order",
        "value": frm.doc.name,
    }

  
});
frm.save()
  }),
      
  frappe.ui.form.on("Others", "other_amount" , function(frm,doctype,name){
  var row = locals[doctype][name]
   row.other_netamount =  row.other_amount * row.quantity;
  row.other_gross = row.other_netamount;
  refresh_field("others");
  })

  frappe.ui.form.on("Others", "quantity" , function(frm,doctype,name){
    var row = locals[doctype][name]
     row.other_netamount =  row.other_amount * row.quantity;
    row.other_gross = row.other_netamount;
    refresh_field("others");
    })
      
  frappe.ui.form.on("Others", "other_discount" , function(frm,doctype,name){
    var row = locals[doctype][name]
     row.other_netamount =  row.other_amount - (row.other_amount * row.other_discount/100);
     row.other_gross = row.other_netamount
    refresh_field("others");
    })

    frappe.ui.form.on("Others", "discount_amount" , function(frm,doctype,name){
      var row = locals[doctype][name]
      row.other_discount = (row.discount_amount / row.other_amount) * 100;
       row.other_netamount =  row.other_amount -  row.discount_amount;
       row.other_gross = row.other_netamount;
      refresh_field("others");
      })

    frappe.ui.form.on("Others", "other_tax" , function(frm,doctype,name){
      var row = locals[doctype][name]
       row.other_gross = row.other_netamount + (row.other_netamount * row.other_tax/100);
      refresh_field("others");
      })
  
  
  
  frappe.ui.form.on("Labor Charge", "hourly_rate", function(frm, doctype, name) {
    
    var row = locals[doctype][name];
    var x = row.fixed_time;
    var y = x.replace(/[^\d.]/g, "");
    row.activity_time = y;
    row.amount = row.activity_time * row.hourly_rate;
    row.gross = row.amount 
    refresh_field("labor_charges");
   
  }); 
      
  frappe.ui.form.on("Labor Charge", "discount", function(frm, doctype, name) {
    
    var row = locals[doctype][name];
    row.discount_amount = row.amount * row.discount/100
    row.net_amount = row.amount - (row.discount_amount);
    row.gross =  row.net_amount  ;
    refresh_field("labor_charges");
   
  });


  frappe.ui.form.on("Labor Charge", "amount", function(frm, doctype, name) {
    
    var row = locals[doctype][name];
    var v = row.activity_time;
    row.hourly_rate =(row.amount / v);
    row.net_amount = row.amount ;
    row.gross =  row.net_amount  ;
    refresh_field("labor_charges");
   
  });

  frappe.ui.form.on("Labor Charge", "activity_time", function(frm, doctype, name) {
    
    var row = locals[doctype][name];
    var v = row.activity_time;
    row.hourly_rate =(row.amount / v);
    row.net_amount = row.amount ;
    row.gross =  row.net_amount  ;
    refresh_field("labor_charges");
   
  });

  frappe.ui.form.on("Labor Charge", "discount_amount", function(frm, doctype, name) {
    
    var row = locals[doctype][name];
    row.discount = (row.discount_amount / row.amount   ) * 100 ;
    row.net_amount = row.amount - (row.discount_amount);
    row.gross =  row.net_amount  ;
    refresh_field("labor_charges");
   
  });
  
  frappe.ui.form.on("Labor Charge", "tax", function(frm, doctype, name) {  
    var row = locals[doctype][name];
    row.gross = row.net_amount + (row.net_amount * row.tax/100)  ;
    refresh_field("labor_charges");
  });
    
  frappe.ui.form.on("Parts Amount", "quantity", function(frm, doctype, name) {
    var row = locals[doctype][name];
    row.amount = row.cost_per_unit * row.quantity;
    row.gross = row.amount 
    refresh_field("parts_amount");    
  });

  frappe.ui.form.on("Parts Amount", "cost_per_unit", function(frm, doctype, name) {    
    var row = locals[doctype][name];
    row.amount = row.cost_per_unit * row.quantity;
    row.gross = row.amount 
    refresh_field("parts_amount");    
  });

  frappe.ui.form.on("Parts Amount", "discount", function(frm, doctype, name) {    
      var row = locals[doctype][name];
      row.net_amount = row.amount - (row.amount * row.discount/100);
      row.gross =  row.net_amount  ;
      refresh_field("parts_amount");     
    });

    frappe.ui.form.on("Parts Amount", "amount", function(frm, doctype, name) {    
      var row = locals[doctype][name];
      row.cost_per_unit = row.amount / (row.quantity);
      row.net_amount = row.amount - (row.amount * row.discount/100);
      row.gross =  row.net_amount  ;
      refresh_field("parts_amount");     
    });

    frappe.ui.form.on("Parts Amount", "discount_amount", function(frm, doctype, name) {    
      var row = locals[doctype][name];
      row.discount = (row.discount_amount / row.amount ) * 100 ;
      row.net_amount = row.amount -  row.discount_amount;
      row.gross =  row.net_amount  ;
      refresh_field("parts_amount");
    });

    frappe.ui.form.on("Parts Amount", "tax_rate", function(frm, doctype, name) {    
      var row = locals[doctype][name];
      row.gross = row.net_amount + (row.net_amount * row.tax_rate/100)  ;
      refresh_field("parts_amount");      
    });

    frappe.ui.form.on("Work_Order", {
  
      "refresh": function(frm, cdt, cdn) {
        
        if(frm.doc.__islocal && frm.doc.job_order_no){
          frm.clear_table('labor_charges');
          frappe.model.with_doc('Job Sheet', frm.doc.job_order_no, function () {
              let source_doc = frappe.model.get_doc('Job Sheet', frm.doc.job_order_no);
              $.each(source_doc.operations, function (index, source_row) {
                var addChild = frm.add_child("labor_charges");
                addChild.employee_id = source_row.employee_id;
                addChild.employee_name = source_row.employee_name;
                addChild.activity = source_row.items;
                addChild.item_name = source_row.item_name;
                addChild.item_code = source_row.item_code;
                addChild.qty = source_row.qty;
                addChild.rate = source_row.rate;
                addChild.uom = source_row.uom;
                addChild.description = source_row.description;
                frm.refresh_field('labor_charges');
                frm.save()
              });
          });
      }}
    })    

  frappe.ui.form.on("Work_Order", {
      refresh: function(frm, cdt, cdn) {
              var d = locals[cdt][cdn];
              if (!frm.is_new() && frm.doc.docstatus === 1) {
                  frm.add_custom_button(__("Create Sales Order"), function() {
                      frappe.new_doc('Sales Order', {
                          "customer": cur_frm.doc.customer_name,
                          "item_code" : cur_frm.doc.items,
                          "work_order_no": cur_frm.doc.name,
                          "company" : cur_frm.doc.company,
                          "vin_number" : cur_frm.doc.vin_number,
                          "registration_no" : cur_frm.doc.registration_no,
                          "brand" : cur_frm.doc.brand,
                      });                      
                  });
              }}
          });

          frappe.ui.form.on('Work_Order', {
            onload(frm) {
              frm.set_query('activity', 'labor_charges', () => {
                    return {
                        filters: {
                            item_group: ["in" , 
                                         [
                                            'AutoServices',
                                            'AutoServices - Body Shop' , 
                                            'AutoServices - Car Care' , 
                                            'AutoServices - Electrical' , 
                                            'AutoServices - Mechanical',
                                           ]
                                         ]
                        }
                    }
                })
            }
            })

            frappe.ui.form.on('Work_Order', {
              onload(frm) {
                frm.set_query('part_no', 'parts_amount', () => {
                      return {
                          filters: {
                              item_group: ["in" , 
                                           [
                                             'AutoParts',
                                             'AutoParts - Brake' ,
                                             'AutoParts - Consumables' ,
                                             'AutoParts - Cooling System',
                                             'AutoParts - Electrical',
                                             'AutoParts - Engine',
                                             'AutoParts - Transmission',
                                             'AutoParts - Automotive' ,
                                           ]
                                          ]
                          }
                      }
                  })
              }
              })

              frappe.ui.form.on('Work_Order', {
                onload(frm) {
                  frm.set_query('other', 'others', () => {
                        return {
                            filters: {
                                item_group: ["in" , ['AutoParts - Others']]
                            }
                        }
                    })
                }
                })
