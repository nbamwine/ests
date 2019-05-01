<?php $admin_privilege = (cud_role_check((int)($this->session->userdata['user_group_id']))); ?>
<body class="hold-transition skin-blue sidebar-mini">
<div class="wrapper">
 <?php include('sidebar.php');?>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        Sample Transporters
      </h1>
      <ol class="breadcrumb">
        <li><a href="<?=base_url();?>/Dashboard/index"><i class="fa fa-dashboard"></i> Home</a></li>
        <li class="active"><a href="<?=base_url();?>/Dashboard/index">Dashboard</a></li>
      </ol>
    </section> 
  <section class="content container-fluid">
  <div class="row">
    <div class="col-md-12">
      <div class="box box-info pull-right">
        <div class="box-header with-border">
          <div class="btn-group">
            <a href="<?=base_url('UserAdministration/sample_transporters');?>"> 
                <div class="btn btn-primary waves-effect waves-light"> 
                            Add Sample transporter
                </div></a>

                <!--<button class="btn btn-pink waves-effect waves-light m-b-5"> <span>Book Flight</span> <i class="fa fa-plane m-l-5"></i> </button>-->
            </div>
        </div>
        <?php
            if ($this->session->flashdata('healthFacility_add_success_msg') != ''):
                echo $this->session->flashdata('healthFacility_add_success_msg');
            endif;
            if ($this->session->flashdata('healthFacility_delete_success_msg') != ''):
                echo $this->session->flashdata('healthFacility_delete_success_msg');
            endif;
            ?>
        <div class="box-body  no-padding">
          <div class="col-xs-12 table-responsive">
                    <table class="table table-striped">
                    <thead>
                    <tr class="info">
                        <th>#</th>
                        <th>Name</th>
                        <th>Office</th>
                        <th>Telphone</th>
                        <th>Address</th>
                        <th>District</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php
                    $i = 1;
                    $app = 1;
          if(isset($data_get_all_sample_transporters)){
                    foreach ($data_get_all_sample_transporters as $row_sample_transporters) {
                        ?>
                        <tr>
                            <td><?= $app; ?>.</td>
                            <td><?= $row_sample_transporters->name; ?></td>
                            <td><?= $row_sample_transporters->office; ?></td>
                            <td><?= $row_sample_transporters->phone; ?></td>
                            <td><?= $row_sample_transporters->address; ?></td>
                            <td><?= $row_sample_transporters->district; ?></td>
                           <td>
                                <button type="button" data-record_id="<?= $row_sample_transporters->id; ?>"
                                        class="btn btn-add btn-xs edit-healthyFacility" data-toggle="modal"
                                        data-target="#updateHealthyFacility"><i class="fa fa-pencil"></i></button>
                                <button type="button" data-record_id="<?= $row_sample_transporters->id; ?>"
                                        class="btn btn-danger btn-xs delete-healthyFacility" data-toggle="modal"
                                        data-target="#deleteHealthyFacility"><i class="fa fa-trash-o"></i></button>
                            </td>
                        </tr>
                        <?php $app++;
                    } 
          }else
          {
          echo "No records found";  
          }?>
          
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  </section> 
<div class="modal fade" id="addDiseases" tabindex="-1" role="dialog" aria-hidden="true"></div>
<div class="modal fade" id="updateDiseases" tabindex="-1" role="dialog" aria-hidden="true"></div>
<div class="modal fade" id="deleteDiseases" tabindex="-1" role="dialog" aria-hidden="true"></div>